/**
 * Book Controller
 */
const { BookRepository } = require("../models");

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await BookRepository.findAll();
    res.status(200).json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Error in getBookById:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Create new book
const createBook = async (req, res) => {
  try {
    // express-validator sudah menangani validasi,
    // jadi kita tidak perlu lagi validasi manual di sini
    const { title, author, year, genre } = req.body;
    const bookData = { title, author, year, genre };
    const newBook = await BookRepository.create(bookData);

    res.status(201).json({
      success: true,
      data: newBook,
    });
  } catch (error) {
    console.error("Error in createBook:", error);
    // Jika validasi gagal, kirim error 400 dengan pesan validasi
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const updatedBook = await BookRepository.update(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error in updateBook:", error);
    // Jika validasi gagal, kirim error 400 dengan pesan validasi
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const result = await BookRepository.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Buku berhasil dihapus",
      data: {},
    });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
