/**
 * Auth Controller
 */
const { AuthService, UserRepository } = require("../models");

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Register user
    const result = await AuthService.register({ name, email, password });

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

    if (error.message === "Email sudah terdaftar" || error.statusCode === 400) {
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
    const result = await AuthService.login(email, password);

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
    const user = await UserRepository.findById(req.user.id);

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
