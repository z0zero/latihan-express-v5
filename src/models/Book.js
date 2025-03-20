/**
 * Book Model - Represents the Book entity
 *
 * Schema for Book:
 * - id: Primary key, auto-incremented
 * - title: The title of the book (required)
 * - author: The author of the book (required)
 * - year: The publication year (optional)
 * - genre: The genre of the book (optional)
 */

/**
 * Book model definition
 * @typedef {Object} Book
 * @property {number} id - Unique identifier
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {number|null} year - Publication year
 * @property {string|null} genre - Book genre
 */

/**
 * Table name in the database
 */
const TABLE_NAME = "books";

/**
 * Column definitions for Book
 */
const COLUMNS = {
  ID: "id",
  TITLE: "title",
  AUTHOR: "author",
  YEAR: "year",
  GENRE: "genre",
};

/**
 * Book model
 */
const Book = {
  TABLE_NAME,
  COLUMNS,

  /**
   * Creates a Book object from database row
   * @param {Object} row - Database row
   * @returns {Book} Book object
   */
  fromDbRow: (row) => {
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      author: row.author,
      year: row.year || null,
      genre: row.genre || null,
    };
  },

  /**
   * Validates book data
   * @param {Object} bookData - Book data to validate
   * @returns {Object} Object containing validation result and error messages
   */
  validate: (bookData) => {
    const errors = [];

    if (!bookData.title || bookData.title.trim() === "") {
      errors.push("Title is required");
    }

    if (!bookData.author || bookData.author.trim() === "") {
      errors.push("Author is required");
    }

    if (bookData.year && isNaN(bookData.year)) {
      errors.push("Year must be a number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = Book;
