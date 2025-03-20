/**
 * Auth Routes
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

// POST /api/auth/register - Register a new user
router.post("/register", validateRegister, authController.register);

// POST /api/auth/login - Login a user
router.post("/login", validateLogin, authController.login);

// GET /api/auth/profile - Get current user profile (protected route)
router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
