import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        // Verify the token hasn't expired
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired, logout
          handleLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user } = response.data.data;

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.error || "Terjadi kesalahan saat registrasi",
      };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data.data;

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || "Email atau password salah",
      };
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // Auth context value
  const value = {
    user,
    loading,
    register,
    login,
    logout: handleLogout,
    getUserProfile,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
