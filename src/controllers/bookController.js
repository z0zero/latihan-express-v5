/**
 * Book Controller - Menangani request terkait buku
 */
const BookRepository = require("../repositories/BookRepository");
const { deleteCoverImage } = require("../config/uploadConfig");
const path = require("path");
const config = require("../config");

/**
 * Fungsi helper untuk menambahkan cover URL pada data buku
 * @param {Object|Array} books - Data buku yang akan ditambahkan cover URL
 * @returns {Object|Array} Data buku yang sudah ditambahkan cover URL
 */
const addCoverUrls = (books) => {
  // Jika books array, proses setiap item dalam array
  if (Array.isArray(books)) {
    return books.map((book) => {
      if (book.cover_image) {
        book.cover_url = `/uploads/covers/${book.cover_image}`;
      } else {
        book.cover_url = null;
      }
      return book;
    });
  }

  // Jika books object, proses satu object
  if (books && books.cover_image) {
    books.cover_url = `/uploads/covers/${books.cover_image}`;
  } else if (books) {
    books.cover_url = null;
  }

  return books;
};

/**
 * @route   GET /api/books
 * @desc    Mendapatkan semua buku
 * @access  Public
 */
const getAllBooks = async (req, res) => {
  try {
    const books = await BookRepository.findAll();

    // Tambahkan URL cover_image untuk setiap buku
    const booksWithCoverUrls = addCoverUrls(books);

    res.status(200).json({
      success: true,
      count: books.length,
      data: booksWithCoverUrls,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error.message);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @route   GET /api/books/:id
 * @desc    Mendapatkan buku berdasarkan ID
 * @access  Public
 */
const getBookById = async (req, res) => {
  try {
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Tambahkan URL cover_image
    const bookWithCoverUrl = addCoverUrls(book);

    res.status(200).json({
      success: true,
      data: bookWithCoverUrl,
    });
  } catch (error) {
    console.error(
      `Error in getBookById with id ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @route   POST /api/books
 * @desc    Membuat buku baru
 * @access  Private
 */
const createBook = async (req, res) => {
  try {
    // Jika ada file yang diupload, tambahkan cover_image ke data
    if (req.file) {
      req.body.cover_image = req.file.filename;
    }

    const book = await BookRepository.create(req.body);

    // Tambahkan URL cover_image
    const bookWithCoverUrl = addCoverUrls(book);

    res.status(201).json({
      success: true,
      data: bookWithCoverUrl,
    });
  } catch (error) {
    console.error("Error in createBook:", error.message);

    // Hapus file yang diupload jika terjadi error
    if (req.file) {
      await deleteCoverImage(req.file.path);
    }

    // Handle validation error
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

/**
 * @route   PUT /api/books/:id
 * @desc    Mengupdate buku berdasarkan ID
 * @access  Private
 */
const updateBook = async (req, res) => {
  try {
    // Dapatkan buku yang akan diupdate untuk cek cover_image yang sudah ada
    const existingBook = await BookRepository.findById(req.params.id);

    if (!existingBook) {
      // Hapus file yang diupload jika buku tidak ditemukan
      if (req.file) {
        await deleteCoverImage(req.file.path);
      }

      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Jika ada file yang diupload, tambahkan cover_image baru ke data dan hapus yang lama
    if (req.file) {
      req.body.cover_image = req.file.filename;

      // Hapus cover image lama jika ada
      if (existingBook.cover_image) {
        await deleteCoverImage(existingBook.cover_image);
      }
    }

    const updatedBook = await BookRepository.update(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Tambahkan URL cover_image
    const bookWithCoverUrl = addCoverUrls(updatedBook);

    res.status(200).json({
      success: true,
      data: bookWithCoverUrl,
    });
  } catch (error) {
    console.error(
      `Error in updateBook with id ${req.params.id}:`,
      error.message
    );

    // Handle validation error
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

/**
 * @route   DELETE /api/books/:id
 * @desc    Menghapus buku berdasarkan ID
 * @access  Private (Admin only)
 */
const deleteBook = async (req, res) => {
  try {
    // Dapatkan buku untuk mengecek cover_image
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Hapus cover image jika ada
    if (book.cover_image) {
      await deleteCoverImage(book.cover_image);
    }

    const isDeleted = await BookRepository.delete(req.params.id);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(
      `Error in deleteBook with id ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @route   POST /api/books/:id/cover
 * @desc    Upload cover image untuk buku
 * @access  Private
 */
const uploadCover = async (req, res) => {
  try {
    // Jika tidak ada file yang diupload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Tidak ada file yang diupload",
      });
    }

    // Cek apakah buku ada
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      // Hapus file yang diupload jika buku tidak ditemukan
      await deleteCoverImage(req.file.path);

      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Hapus cover image lama jika ada
    if (book.cover_image) {
      await deleteCoverImage(book.cover_image);
    }

    // Update buku dengan cover_image baru
    const updatedBook = await BookRepository.update(req.params.id, {
      cover_image: req.file.filename,
    });

    // Tambahkan URL cover_image
    const bookWithCoverUrl = addCoverUrls(updatedBook);

    res.status(200).json({
      success: true,
      data: {
        cover_image: req.file.filename,
        cover_url: `/uploads/covers/${req.file.filename}`,
        book: bookWithCoverUrl,
      },
    });
  } catch (error) {
    console.error(`Error in uploadCover:`, error.message);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @route   DELETE /api/books/:id/cover
 * @desc    Menghapus cover image buku
 * @access  Private
 */
const deleteCover = async (req, res) => {
  try {
    // Cek apakah buku ada
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Jika buku tidak memiliki cover_image
    if (!book.cover_image) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak memiliki cover image",
      });
    }

    // Hapus cover image
    await deleteCoverImage(book.cover_image);

    // Update buku dengan menghapus cover_image
    const updatedBook = await BookRepository.update(req.params.id, {
      cover_image: null,
    });

    // Tambahkan URL cover_image yang sudah null
    const bookWithCoverUrl = addCoverUrls(updatedBook);

    res.status(200).json({
      success: true,
      data: bookWithCoverUrl,
    });
  } catch (error) {
    console.error(`Error in deleteCover:`, error.message);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

/**
 * @route   GET /api/books/:id/cover
 * @desc    Mendapatkan cover image buku
 * @access  Public
 */
const getCover = async (req, res) => {
  try {
    // Cek apakah buku ada
    const book = await BookRepository.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak ditemukan",
      });
    }

    // Jika buku tidak memiliki cover_image
    if (!book.cover_image) {
      return res.status(404).json({
        success: false,
        error: "Buku tidak memiliki cover image",
      });
    }

    // Return URL dari cover image
    res.status(200).json({
      success: true,
      data: {
        cover_image: book.cover_image,
        cover_url: `/uploads/covers/${book.cover_image}`,
      },
    });
  } catch (error) {
    console.error(`Error in getCover:`, error.message);
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
  uploadCover,
  deleteCover,
  getCover,
};
