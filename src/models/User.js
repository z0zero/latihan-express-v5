/**
 * User Model - Using MySQL database
 */
const { pool } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

// User Model operations
const User = {
  // Find all users
  findAll: async () => {
    try {
      const [rows] = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users"
      );
      return rows;
    } catch (error) {
      console.error("Error finding all users:", error.message);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error finding user with id ${id}:`, error.message);
      throw error;
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error.message);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const { name, email, password, role = "user" } = userData;

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
      );

      const id = result.insertId;
      return {
        id,
        name,
        email,
        role,
      };
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return null;
      }

      const { name, email, password, role } = userData;

      // If updating email, check if it's already used by another user
      if (email && email !== user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          throw new Error("Email sudah digunakan");
        }
      }

      // Build update query
      let updates = [];
      let params = [];

      if (name) {
        updates.push("name = ?");
        params.push(name);
      }

      if (email) {
        updates.push("email = ?");
        params.push(email);
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.push("password = ?");
        params.push(hashedPassword);
      }

      if (role) {
        updates.push("role = ?");
        params.push(role);
      }

      if (updates.length === 0) {
        return user; // No updates to make
      }

      // Add id to params
      params.push(id);

      const [result] = await pool.query(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      if (result.affectedRows === 0) {
        return null;
      }

      // Return updated user without password
      return await User.findById(id);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error.message);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error.message);
      throw error;
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const { name, email, password } = userData;

      // Create user with 'user' role
      const newUser = await User.create({
        name,
        email,
        password,
        role: "user",
      });

      return {
        user: newUser,
        token: User.generateToken(newUser),
      };
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error;
    }
  },

  // Login a user
  login: async (email, password) => {
    try {
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error("Email atau password salah");
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Email atau password salah");
      }

      // Return user without password
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return {
        user: userWithoutPassword,
        token: User.generateToken(userWithoutPassword),
      };
    } catch (error) {
      console.error("Error logging in user:", error.message);
      throw error;
    }
  },

  // Generate JWT token
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      console.error("Error verifying token:", error.message);
      throw error;
    }
  },
};

module.exports = User;
