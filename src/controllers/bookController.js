/**
 * Book Controller
 */
const Book = require("../models/Book");

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
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
    const book = await Book.findById(req.params.id);

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
    const newBook = await Book.create(bookData);

    res.status(201).json({
      success: true,
      data: newBook,
    });
  } catch (error) {
    console.error("Error in createBook:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.update(req.params.id, req.body);

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
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const result = await Book.delete(req.params.id);

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
