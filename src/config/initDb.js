/**
 * Database Initialization Script
 */
const fs = require("fs");
const path = require("path");
const { pool, initPool } = require("./database");
const config = require("./index");

// Function to execute SQL file
const executeSqlFile = async (filePath) => {
  try {
    // Read SQL file
    const sql = fs.readFileSync(filePath, "utf8");

    // Split SQL by semicolon to get individual queries
    const queries = sql.split(";").filter((query) => query.trim() !== "");

    // Execute each query
    for (const query of queries) {
      if (query.trim()) {
        await pool.query(query);
      }
    }

    console.log("Database initialized successfully.");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    const dbName = config.db.database;

    // Create database if not exists using initPool (without database)
    await initPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' checked/created.`);

    // Use database
    await pool.query(`USE \`${dbName}\``);

    // Execute SQL file to create tables and seed data
    const sqlFilePath = path.join(__dirname, "database.sql");
    await executeSqlFile(sqlFilePath);

    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
};
