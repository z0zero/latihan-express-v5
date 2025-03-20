/**
 * API Routes Index
 */
const express = require("express");
const router = express.Router();
const bookRoutes = require("./bookRoutes");

// API Routes
router.use("/books", bookRoutes);

// API Health Check
router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

module.exports = router;
