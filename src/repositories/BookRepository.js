/**
 * BookRepository - Handles all database operations for Book entity
 */
const Book = require("../models/Book");
const { ValidationError, Op } = require("sequelize");

/**
 * Repository untuk mengelola operasi CRUD buku ke database
 */
class BookRepository {
  /**
   * Mengambil semua buku dari database
   * @returns {Promise<Array>} Array berisi objek buku
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findAll() {
    try {
      const books = await Book.findAll();
      return books.map((book) => book.toJSON());
    } catch (error) {
      console.error("Error finding all books:", error.message);
      throw error;
    }
  }

  /**
   * Mencari buku berdasarkan ID
   * @param {number} id - ID buku yang dicari
   * @returns {Promise<Object|null>} Objek buku jika ditemukan, null jika tidak
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findById(id) {
    try {
      const book = await Book.findByPk(id);
      return book ? book.toJSON() : null;
    } catch (error) {
      console.error(`Error finding book with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Membuat buku baru di database
   * @param {Object} bookData - Data buku yang akan dibuat
   * @param {string} bookData.title - Judul buku (wajib)
   * @param {string} bookData.author - Penulis buku (wajib)
   * @param {number} [bookData.year] - Tahun terbit
   * @param {string} [bookData.genre] - Genre buku
   * @returns {Promise<Object>} Objek buku yang telah dibuat dengan ID
   * @throws {Error} Jika terjadi error saat mengakses database atau validasi gagal
   */
  async create(bookData) {
    try {
      const newBook = await Book.create(bookData);
      return newBook.toJSON();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format validasi error dari Sequelize
        const validationError = new Error(
          "Validation failed: " +
            error.errors.map((err) => err.message).join(", ")
        );
        validationError.statusCode = 400;
        throw validationError;
      }
      console.error("Error creating book:", error.message);
      throw error;
    }
  }

  /**
   * Memperbarui buku yang sudah ada
   * @param {number} id - ID buku yang akan diperbarui
   * @param {Object} bookData - Data buku yang akan diperbarui
   * @param {string} [bookData.title] - Judul buku
   * @param {string} [bookData.author] - Penulis buku
   * @param {number} [bookData.year] - Tahun terbit
   * @param {string} [bookData.genre] - Genre buku
   * @returns {Promise<Object|null>} Objek buku setelah diperbarui, null jika buku tidak ditemukan
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async update(id, bookData) {
    try {
      // Gunakan transaction untuk memastikan operasi atomik
      const book = await Book.findByPk(id);
      if (!book) {
        return null;
      }

      // Update book data
      await book.update(bookData);

      // Return updated book
      return book.toJSON();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format validasi error dari Sequelize
        const validationError = new Error(
          "Validation failed: " +
            error.errors.map((err) => err.message).join(", ")
        );
        validationError.statusCode = 400;
        throw validationError;
      }
      console.error(`Error updating book with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Menghapus buku dari database
   * @param {number} id - ID buku yang akan dihapus
   * @returns {Promise<boolean>} true jika berhasil dihapus, false jika tidak ditemukan
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async delete(id) {
    try {
      const result = await Book.destroy({
        where: { id },
      });
      return result > 0;
    } catch (error) {
      console.error(`Error deleting book with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Mencari buku berdasarkan kriteria tertentu
   * @param {Object} criteria - Kriteria pencarian
   * @param {string} [criteria.title] - Judul buku untuk dicari (partial match)
   * @param {string} [criteria.author] - Penulis buku untuk dicari (partial match)
   * @param {number} [criteria.year] - Tahun terbit buku (exact match)
   * @param {string} [criteria.genre] - Genre buku (exact match)
   * @returns {Promise<Array>} Array berisi objek buku yang cocok dengan kriteria
   * @throws {Error} Jika terjadi error saat mengakses database
   */
  async findByCriteria(criteria) {
    try {
      const where = {};

      if (criteria.title) {
        where.title = { [Op.like]: `%${criteria.title}%` };
      }

      if (criteria.author) {
        where.author = { [Op.like]: `%${criteria.author}%` };
      }

      if (criteria.year) {
        where.year = criteria.year;
      }

      if (criteria.genre) {
        where.genre = criteria.genre;
      }

      const books = await Book.findAll({ where });
      return books.map((book) => book.toJSON());
    } catch (error) {
      console.error("Error finding books by criteria:", error.message);
      throw error;
    }
  }
}

module.exports = new BookRepository();
