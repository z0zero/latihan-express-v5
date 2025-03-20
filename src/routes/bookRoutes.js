/**
 * Book Routes
 */
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const {
  validateCreateBook,
  validateUpdateBook,
  validateBookId,
} = require("../validators/bookValidator");
const { authenticate, checkRole } = require("../middleware/auth");

// PUBLIC ROUTES
// GET all books - Bisa diakses semua orang
router.get("/", bookController.getAllBooks);

// GET book by ID - Bisa diakses semua orang
router.get("/:id", validateBookId, bookController.getBookById);

// PROTECTED ROUTES - Require authentication
// POST new book - Hanya user yang terautentikasi
router.post("/", authenticate, validateCreateBook, bookController.createBook);

// PUT/UPDATE book - Hanya user yang terautentikasi
router.put("/:id", authenticate, validateUpdateBook, bookController.updateBook);

// DELETE book - Hanya admin yang bisa menghapus
router.delete(
  "/:id",
  authenticate,
  checkRole(["admin"]),
  validateBookId,
  bookController.deleteBook
);

module.exports = router;
