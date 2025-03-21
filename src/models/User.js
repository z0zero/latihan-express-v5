/**
 * User Model - Represents the User entity
 *
 * Schema for User:
 * - id: Primary key, auto-incremented
 * - name: The name of the user (required)
 * - email: The email of the user (required, unique)
 * - password: Hashed password (required)
 * - role: User role, default is "user" (optional)
 * - created_at: Timestamp of when the user was created
 * - updated_at: Timestamp of when the user was last updated
 */
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * User model definition
 * @typedef {Object} User
 * @property {number} id - Unique identifier
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} password - Hashed password (only included in certain operations)
 * @property {string} role - User's role (user, admin)
 * @property {Date} created_at - Creation timestamp
 * @property {Date} updated_at - Last update timestamp
 */

/**
 * Role definitions
 */
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

/**
 * Define Sequelize model
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email is not valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        len: {
          args: [6],
          msg: "Password must be at least 6 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM(ROLES.ADMIN, ROLES.USER),
      defaultValue: ROLES.USER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

/**
 * Constants for backward compatibility
 */
User.TABLE_NAME = "users";
User.COLUMNS = {
  ID: "id",
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
  ROLE: "role",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
};
User.ROLES = ROLES;

/**
 * Methods for backward compatibility
 */
User.fromDbRow = (row, includePassword = false) => {
  if (!row) return null;

  const user = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || ROLES.USER,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  if (includePassword && row.password) {
    user.password = row.password;
  }

  return user;
};

User.validate = (userData, isCreating = true) => {
  const errors = [];

  // Name validation
  if (isCreating && (!userData.name || userData.name.trim() === "")) {
    errors.push("Name is required");
  }

  // Email validation
  if (isCreating && (!userData.email || userData.email.trim() === "")) {
    errors.push("Email is required");
  } else if (userData.email && !User.isValidEmail(userData.email)) {
    errors.push("Email is not valid");
  }

  // Password validation
  if (isCreating && (!userData.password || userData.password.trim() === "")) {
    errors.push("Password is required");
  } else if (userData.password && userData.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  // Role validation
  if (userData.role && ![ROLES.ADMIN, ROLES.USER].includes(userData.role)) {
    errors.push('Role must be either "admin" or "user"');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

User.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = User;
