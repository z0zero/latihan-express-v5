/**
 * Models index - Exports all models and repositories
 * This provides backward compatibility for existing code
 */

const Book = require("./Book");
const BookRepository = require("../repositories/BookRepository");

// Export Book model and repository
module.exports = {
  // Models
  Book,

  // Repositories
  BookRepository,

  // Legacy support - export repository as Book to maintain compatibility
  LegacyBook: BookRepository,
};
