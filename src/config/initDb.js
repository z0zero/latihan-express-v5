/**
 * Database Initialization Script
 */
const fs = require("fs");
const path = require("path");
const { sequelize, initPool } = require("./database");
const config = require("./index");

// Function untuk sinkronisasi model dengan database
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully.");
    return true;
  } catch (error) {
    console.error("Error synchronizing database models:", error.message);
    throw error;
  }
};

// Function to execute SQL file (untuk mempertahankan backward compatibility)
const executeSqlFile = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log("SQL file not found, skipping initialization from SQL file.");
      return true;
    }

    // Read SQL file
    const sql = fs.readFileSync(filePath, "utf8");

    // Split SQL by semicolon to get individual queries
    const queries = sql.split(";").filter((query) => query.trim() !== "");

    // Execute each query
    for (const query of queries) {
      if (query.trim()) {
        await sequelize.query(query, {
          type: sequelize.QueryTypes.RAW,
        });
      }
    }

    console.log("Database initialized from SQL file successfully.");
    return true;
  } catch (error) {
    console.error("Error initializing database from SQL file:", error.message);
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
    await sequelize.query(`USE \`${dbName}\``);

    // Sync all models with the database
    await syncModels();

    // Execute SQL file to seed data if needed
    const sqlFilePath = path.join(__dirname, "database.sql");
    if (fs.existsSync(sqlFilePath)) {
      await executeSqlFile(sqlFilePath);
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  syncModels,
  executeSqlFile,
};
