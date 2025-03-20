/**
 * AuthService - Handles authentication related operations
 */
const jwt = require("jsonwebtoken");
const config = require("../config");
const UserRepository = require("../repositories/UserRepository");
const User = require("../models/User");

/**
 * Service untuk mengelola operasi autentikasi
 */
class AuthService {
  /**
   * Mendaftarkan user baru
   * @param {Object} userData - Data user yang akan didaftarkan
   * @param {string} userData.name - Nama user
   * @param {string} userData.email - Email user
   * @param {string} userData.password - Password user
   * @returns {Promise<Object>} Objek berisi user dan token
   * @throws {Error} Jika terjadi error saat registrasi
   */
  async register(userData) {
    try {
      // Create user with 'user' role
      const newUser = await UserRepository.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: User.ROLES.USER,
      });

      return {
        user: newUser,
        token: this.generateToken(newUser),
      };
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error;
    }
  }

  /**
   * Melakukan login user
   * @param {string} email - Email user
   * @param {string} password - Password user
   * @returns {Promise<Object>} Objek berisi user dan token
   * @throws {Error} Jika email atau password salah atau terjadi error
   */
  async login(email, password) {
    try {
      // Verify credentials
      const user = await UserRepository.verifyCredentials(email, password);

      if (!user) {
        throw new Error("Email atau password salah");
      }

      return {
        user,
        token: this.generateToken(user),
      };
    } catch (error) {
      console.error("Error logging in user:", error.message);
      throw error;
    }
  }

  /**
   * Generate JWT token
   * @param {Object} user - User yang akan dibuat tokennya
   * @returns {string} Token JWT
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Verifikasi token JWT
   * @param {string} token - Token JWT
   * @returns {Object} Payload token yang sudah diverifikasi
   * @throws {Error} Jika token tidak valid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      console.error("Error verifying token:", error.message);
      throw error;
    }
  }

  /**
   * Mendapatkan user berdasarkan token
   * @param {string} token - Token JWT
   * @returns {Promise<Object|null>} User jika token valid, null jika token tidak valid
   */
  async getUserFromToken(token) {
    try {
      const decoded = this.verifyToken(token);
      return await UserRepository.findById(decoded.id);
    } catch (error) {
      console.error("Error getting user from token:", error.message);
      return null;
    }
  }
}

module.exports = new AuthService();
