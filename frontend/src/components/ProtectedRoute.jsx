import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Route that requires authentication
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If route requires admin role and user is not admin, redirect to books page
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/books" />;
  }

  // Render children if authenticated and has proper permissions
  return children;
};
