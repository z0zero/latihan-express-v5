/**
 * Authentication Middleware
 */
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

// Middleware untuk memeriksa apakah user sudah terautentikasi
const authenticate = async (req, res, next) => {
  try {
    // Get the token from the header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Tidak ada token, akses ditolak",
      });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Add user to request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token kedaluwarsa, silakan login kembali",
      });
    }

    res.status(401).json({
      success: false,
      error: "Token tidak valid, akses ditolak",
    });
  }
};

// Middleware untuk memeriksa apakah user memiliki role tertentu
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Tidak terotentikasi, akses ditolak",
      });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Anda tidak memiliki izin untuk operasi ini",
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  checkRole,
};
