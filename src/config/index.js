/**
 * Application configuration
 */
require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "book_api",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-should-be-changed",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // 1 day
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d", // 7 days
  },
};

module.exports = config;
