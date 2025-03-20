/**
 * BookRepository - Handles all database operations for Book entity
 */
const { pool } = require("../config/database");
const Book = require("../models/Book");

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
      const [rows] = await pool.query(`SELECT * FROM ${Book.TABLE_NAME}`);
      return rows.map((row) => Book.fromDbRow(row));
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
      const [rows] = await pool.query(
        `SELECT * FROM ${Book.TABLE_NAME} WHERE ${Book.COLUMNS.ID} = ?`,
        [id]
      );

      return rows.length ? Book.fromDbRow(rows[0]) : null;
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
      // Validasi data buku
      const validation = Book.validate(bookData);
      if (!validation.isValid) {
        const error = new Error(
          "Validation failed: " + validation.errors.join(", ")
        );
        error.statusCode = 400;
        throw error;
      }

      const { title, author, year, genre } = bookData;

      const [result] = await pool.query(
        `INSERT INTO ${Book.TABLE_NAME} (${Book.COLUMNS.TITLE}, ${Book.COLUMNS.AUTHOR}, ${Book.COLUMNS.YEAR}, ${Book.COLUMNS.GENRE}) 
         VALUES (?, ?, ?, ?)`,
        [title, author, year, genre]
      );

      const id = result.insertId;
      return { id, title, author, year, genre };
    } catch (error) {
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
      // Check if book exists
      const book = await this.findById(id);
      if (!book) {
        return null;
      }

      // Perbarui data buku
      const { title, author, year, genre } = bookData;

      const [result] = await pool.query(
        `UPDATE ${Book.TABLE_NAME} 
         SET ${Book.COLUMNS.TITLE} = ?, 
             ${Book.COLUMNS.AUTHOR} = ?, 
             ${Book.COLUMNS.YEAR} = ?, 
             ${Book.COLUMNS.GENRE} = ? 
         WHERE ${Book.COLUMNS.ID} = ?`,
        [
          title || book.title,
          author || book.author,
          year !== undefined ? year : book.year,
          genre !== undefined ? genre : book.genre,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      // Kembalikan buku yang sudah diperbarui
      return await this.findById(id);
    } catch (error) {
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
      const [result] = await pool.query(
        `DELETE FROM ${Book.TABLE_NAME} WHERE ${Book.COLUMNS.ID} = ?`,
        [id]
      );

      return result.affectedRows > 0;
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
      let query = `SELECT * FROM ${Book.TABLE_NAME} WHERE 1 = 1`;
      const params = [];

      if (criteria.title) {
        query += ` AND ${Book.COLUMNS.TITLE} LIKE ?`;
        params.push(`%${criteria.title}%`);
      }

      if (criteria.author) {
        query += ` AND ${Book.COLUMNS.AUTHOR} LIKE ?`;
        params.push(`%${criteria.author}%`);
      }

      if (criteria.year) {
        query += ` AND ${Book.COLUMNS.YEAR} = ?`;
        params.push(criteria.year);
      }

      if (criteria.genre) {
        query += ` AND ${Book.COLUMNS.GENRE} = ?`;
        params.push(criteria.genre);
      }

      const [rows] = await pool.query(query, params);
      return rows.map((row) => Book.fromDbRow(row));
    } catch (error) {
      console.error("Error finding books by criteria:", error.message);
      throw error;
    }
  }
}

module.exports = new BookRepository();
