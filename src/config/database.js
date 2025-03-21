/**
 * Sequelize Database Configuration
 */
const { Sequelize } = require("sequelize");
const config = require("./index");

// Create Sequelize instance
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "mysql",
    logging: config.env === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Function to test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connection established successfully via Sequelize.");
    return true;
  } catch (error) {
    console.error("Error connecting to MySQL database:", error.message);
    throw error;
  }
};

// Untuk backward compatibility
const pool = {
  query: async (sql, params) => {
    // Gunakan sequelize.query untuk menjalankan raw SQL query
    const [rows] = await sequelize.query(sql, {
      replacements: params,
      type: Sequelize.QueryTypes.SELECT,
    });
    return [rows];
  },
};

const initPool = {
  query: async (sql, params) => {
    // Gunakan sequelize.query untuk menjalankan raw SQL query
    return await sequelize.query(sql, {
      replacements: params,
      type: Sequelize.QueryTypes.RAW,
    });
  },
  getConnection: async () => {
    await sequelize.authenticate();
    return {
      release: () => {}, // Dummy release method for compatibility
    };
  },
};

module.exports = {
  sequelize,
  Sequelize,
  pool,
  initPool,
  testConnection,
};
