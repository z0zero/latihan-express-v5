/**
 * Main Application Entry Point
 */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");
const { testConnection } = require("./config/database");
const { initializeDatabase } = require("./config/initDb");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for form data
app.use(cors()); // Enable CORS for all routes
app.use(morgan("dev")); // HTTP request logger

// API Routes
app.use("/api", routes);

// Error handler for 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: "Server Error",
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Initialize database (create tables and seed data)
    await initializeDatabase();

    // Start the server
    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.env} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
