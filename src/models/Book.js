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
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Book model definition
 * @typedef {Object} Book
 * @property {number} id - Unique identifier
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {number|null} year - Publication year
 * @property {string|null} genre - Book genre
 */

// Definisi Model menggunakan Sequelize
const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
      },
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Author is required",
        },
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Year must be a number",
        },
        min: {
          args: [1000],
          msg: "Year must be at least 1000",
        },
        max: {
          args: [new Date().getFullYear()],
          msg: `Year cannot be greater than ${new Date().getFullYear()}`,
        },
      },
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "books",
    timestamps: false,
    underscored: true,
  }
);

// Constants untuk backward compatibility
Book.TABLE_NAME = "books";
Book.COLUMNS = {
  ID: "id",
  TITLE: "title",
  AUTHOR: "author",
  YEAR: "year",
  GENRE: "genre",
};

/**
 * Creates a Book object from database row
 * @param {Object} row - Database row
 * @returns {Book} Book object
 */
Book.fromDbRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: row.year || null,
    genre: row.genre || null,
  };
};

/**
 * Validates book data
 * @param {Object} bookData - Book data to validate
 * @returns {Object} Object containing validation result and error messages
 */
Book.validate = (bookData) => {
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
};

module.exports = Book;
