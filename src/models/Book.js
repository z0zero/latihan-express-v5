/**
 * Book Model - Using MySQL database
 */
const { pool } = require("../config/database");

// Book Model operations
const Book = {
  // Get all books
  findAll: async () => {
    try {
      const [rows] = await pool.query("SELECT * FROM books");
      return rows;
    } catch (error) {
      console.error("Error finding all books:", error.message);
      throw error;
    }
  },

  // Get book by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error finding book with id ${id}:`, error.message);
      throw error;
    }
  },

  // Create new book
  create: async (bookData) => {
    try {
      const { title, author, year, genre } = bookData;
      const [result] = await pool.query(
        "INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)",
        [title, author, year, genre]
      );

      const id = result.insertId;
      return { id, title, author, year, genre };
    } catch (error) {
      console.error("Error creating book:", error.message);
      throw error;
    }
  },

  // Update book
  update: async (id, bookData) => {
    try {
      // Check if book exists
      const book = await Book.findById(id);
      if (!book) {
        return null;
      }

      // Update book data
      const { title, author, year, genre } = bookData;

      const [result] = await pool.query(
        "UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?",
        [
          title || book.title,
          author || book.author,
          year || book.year,
          genre || book.genre,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      // Return updated book
      return await Book.findById(id);
    } catch (error) {
      console.error(`Error updating book with id ${id}:`, error.message);
      throw error;
    }
  },

  // Delete book
  delete: async (id) => {
    try {
      const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting book with id ${id}:`, error.message);
      throw error;
    }
  },
};

module.exports = Book;
