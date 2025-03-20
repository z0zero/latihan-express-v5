/**
 * MySQL Database Configuration
 */
const mysql = require("mysql2/promise");
const config = require("./index");

// Create connection pool without specific database
const createPool = (withDatabase = true) => {
  const poolConfig = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  // Only include database if withDatabase is true
  if (withDatabase) {
    poolConfig.database = config.db.database;
  }

  return mysql.createPool(poolConfig);
};

// Initial pool without database for initialization
const initPool = createPool(false);

// Main pool with database for normal operations
const pool = createPool(true);

// Function to test database connection
const testConnection = async () => {
  try {
    const connection = await initPool.getConnection();
    console.log("MySQL Connection established successfully.");
    connection.release();
    return true;
  } catch (error) {
    console.error("Error connecting to MySQL database:", error.message);
    throw error;
  }
};

module.exports = {
  pool,
  initPool,
  testConnection,
};
