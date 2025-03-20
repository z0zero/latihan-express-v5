/**
 * UserRepository - Handles all database operations for User entity
 */
const { pool } = require("../config/database");
const bcrypt = require("bcrypt");
const User = require("../models/User");

/**
 * Repository untuk mengelola operasi CRUD user ke database
 */
class UserRepository {
  /**
   * Mengambil semua user dari database (tanpa password)
   * @returns {Promise<Array>} Array berisi objek user tanpa password
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findAll() {
    try {
      const [rows] = await pool.query(
        `SELECT ${User.COLUMNS.ID}, ${User.COLUMNS.NAME}, ${User.COLUMNS.EMAIL}, 
         ${User.COLUMNS.ROLE}, ${User.COLUMNS.CREATED_AT}, ${User.COLUMNS.UPDATED_AT} 
         FROM ${User.TABLE_NAME}`
      );
      return rows.map((row) => User.fromDbRow(row));
    } catch (error) {
      console.error("Error finding all users:", error.message);
      throw error;
    }
  }

  /**
   * Mencari user berdasarkan ID (tanpa password)
   * @param {number} id - ID user yang dicari
   * @returns {Promise<Object|null>} Objek user jika ditemukan, null jika tidak
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT ${User.COLUMNS.ID}, ${User.COLUMNS.NAME}, ${User.COLUMNS.EMAIL}, 
         ${User.COLUMNS.ROLE}, ${User.COLUMNS.CREATED_AT}, ${User.COLUMNS.UPDATED_AT} 
         FROM ${User.TABLE_NAME} WHERE ${User.COLUMNS.ID} = ?`,
        [id]
      );

      return rows.length ? User.fromDbRow(rows[0]) : null;
    } catch (error) {
      console.error(`Error finding user with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Mencari user berdasarkan email (dengan password)
   * @param {string} email - Email user yang dicari
   * @returns {Promise<Object|null>} Objek user jika ditemukan, null jika tidak
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM ${User.TABLE_NAME} WHERE ${User.COLUMNS.EMAIL} = ?`,
        [email]
      );

      return rows.length ? User.fromDbRow(rows[0], true) : null;
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error.message);
      throw error;
    }
  }

  /**
   * Membuat user baru di database
   * @param {Object} userData - Data user yang akan dibuat
   * @param {string} userData.name - Nama user (wajib)
   * @param {string} userData.email - Email user (wajib)
   * @param {string} userData.password - Password user (wajib)
   * @param {string} [userData.role=user] - Role user
   * @returns {Promise<Object>} Objek user yang telah dibuat (tanpa password)
   * @throws {Error} Jika terjadi error saat mengakses database atau validasi gagal
   */
  async create(userData) {
    try {
      // Validasi data user
      const validation = User.validate(userData);
      if (!validation.isValid) {
        const error = new Error(
          "Validation failed: " + validation.errors.join(", ")
        );
        error.statusCode = 400;
        throw error;
      }

      const { name, email, password, role = User.ROLES.USER } = userData;

      // Check if email already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        const error = new Error("Email sudah terdaftar");
        error.statusCode = 400;
        throw error;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.query(
        `INSERT INTO ${User.TABLE_NAME} 
         (${User.COLUMNS.NAME}, ${User.COLUMNS.EMAIL}, ${User.COLUMNS.PASSWORD}, ${User.COLUMNS.ROLE}) 
         VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, role]
      );

      const id = result.insertId;
      return { id, name, email, role };
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  }

  /**
   * Memperbarui user yang sudah ada
   * @param {number} id - ID user yang akan diperbarui
   * @param {Object} userData - Data user yang akan diperbarui
   * @param {string} [userData.name] - Nama user
   * @param {string} [userData.email] - Email user
   * @param {string} [userData.password] - Password baru user
   * @param {string} [userData.role] - Role baru user
   * @returns {Promise<Object|null>} Objek user setelah diperbarui, null jika user tidak ditemukan
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async update(id, userData) {
    try {
      // Validasi data user untuk update
      const validation = User.validate(userData, false);
      if (!validation.isValid) {
        const error = new Error(
          "Validation failed: " + validation.errors.join(", ")
        );
        error.statusCode = 400;
        throw error;
      }

      // Check if user exists
      const user = await this.findById(id);
      if (!user) {
        return null;
      }

      const { name, email, password, role } = userData;

      // If updating email, check if it's already used by another user
      if (email && email !== user.email) {
        const existingUser = await this.findByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          const error = new Error("Email sudah digunakan");
          error.statusCode = 400;
          throw error;
        }
      }

      // Build update query
      let updates = [];
      let params = [];

      if (name) {
        updates.push(`${User.COLUMNS.NAME} = ?`);
        params.push(name);
      }

      if (email) {
        updates.push(`${User.COLUMNS.EMAIL} = ?`);
        params.push(email);
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.push(`${User.COLUMNS.PASSWORD} = ?`);
        params.push(hashedPassword);
      }

      if (role) {
        updates.push(`${User.COLUMNS.ROLE} = ?`);
        params.push(role);
      }

      if (updates.length === 0) {
        return user; // No updates to make
      }

      // Add id to params
      params.push(id);

      const [result] = await pool.query(
        `UPDATE ${User.TABLE_NAME} SET ${updates.join(", ")} WHERE ${
          User.COLUMNS.ID
        } = ?`,
        params
      );

      if (result.affectedRows === 0) {
        return null;
      }

      // Return updated user without password
      return await this.findById(id);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Menghapus user dari database
   * @param {number} id - ID user yang akan dihapus
   * @returns {Promise<boolean>} true jika berhasil dihapus, false jika tidak ditemukan
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async delete(id) {
    try {
      const [result] = await pool.query(
        `DELETE FROM ${User.TABLE_NAME} WHERE ${User.COLUMNS.ID} = ?`,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Verifies user credentials
   * @param {string} email - User email
   * @param {string} password - User password (plain text)
   * @returns {Promise<Object|null>} User object if credentials are valid, null otherwise
   * @throws {Error} If database error occurs
   */
  async verifyCredentials(email, password) {
    try {
      // Find user by email
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }

      // Return user without password
      delete user.password;
      return user;
    } catch (error) {
      console.error("Error verifying credentials:", error.message);
      throw error;
    }
  }
}

module.exports = new UserRepository();
