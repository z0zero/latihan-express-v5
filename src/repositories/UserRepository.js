/**
 * UserRepository - Handles all database operations for User entity
 */
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { ValidationError, Op } = require("sequelize");

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
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      return users.map((user) => user.toJSON());
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
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      return user ? user.toJSON() : null;
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
      const user = await User.findOne({
        where: { email },
      });

      return user ? user.toJSON() : null;
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
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user with hashed password
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || User.ROLES.USER,
      });

      // Return user without password
      const user = newUser.toJSON();
      delete user.password;
      return user;
    } catch (error) {
      // Handle validation errors
      if (error instanceof ValidationError) {
        const validationError = new Error(
          "Validation failed: " +
            error.errors.map((err) => err.message).join(", ")
        );
        validationError.statusCode = 400;
        throw validationError;
      }

      // Handle unique constraint error (duplicate email)
      if (error.name === "SequelizeUniqueConstraintError") {
        const dupError = new Error("Email sudah terdaftar");
        dupError.statusCode = 400;
        throw dupError;
      }

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
      // Find user
      const user = await User.findByPk(id);
      if (!user) {
        return null;
      }

      // Prepare update data
      const updateData = {};

      if (userData.name) {
        updateData.name = userData.name;
      }

      if (userData.email) {
        updateData.email = userData.email;
      }

      if (userData.role) {
        updateData.role = userData.role;
      }

      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(userData.password, salt);
      }

      // Update user
      await user.update(updateData);

      // Return updated user without password
      const updatedUser = user.toJSON();
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      // Handle validation errors
      if (error instanceof ValidationError) {
        const validationError = new Error(
          "Validation failed: " +
            error.errors.map((err) => err.message).join(", ")
        );
        validationError.statusCode = 400;
        throw validationError;
      }

      // Handle unique constraint error (duplicate email)
      if (error.name === "SequelizeUniqueConstraintError") {
        const dupError = new Error("Email sudah digunakan");
        dupError.statusCode = 400;
        throw dupError;
      }

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
      const result = await User.destroy({
        where: { id },
      });
      return result > 0;
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
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Check password
      const userJson = user.toJSON();
      const isMatch = await bcrypt.compare(password, userJson.password);
      if (!isMatch) {
        return null;
      }

      // Return user without password
      delete userJson.password;
      return userJson;
    } catch (error) {
      console.error("Error verifying credentials:", error.message);
      throw error;
    }
  }
}

module.exports = new UserRepository();
