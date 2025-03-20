/**
 * Models index - Exports all models and repositories
 * This provides backward compatibility for existing code
 */

// Models
const Book = require("./Book");
const User = require("./User");

// Repositories
const BookRepository = require("../repositories/BookRepository");
const UserRepository = require("../repositories/UserRepository");

// Services
const AuthService = require("../services/AuthService");

// Export models, repositories and services
module.exports = {
  // Models
  Book,
  User,

  // Repositories
  BookRepository,
  UserRepository,

  // Services
  AuthService,

  // Legacy support - export repositories as models to maintain compatibility
  LegacyBook: BookRepository,
  LegacyUser: UserRepository,
};
