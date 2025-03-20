/**
 * Auth Controller
 */
const User = require("../models/User");

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Register user
    const result = await User.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);

    if (error.message === "Email sudah terdaftar") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Login user
    const result = await User.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);

    if (error.message === "Email atau password salah") {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
