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

// GET all books
router.get("/", bookController.getAllBooks);

// GET book by ID
router.get("/:id", validateBookId, bookController.getBookById);

// POST new book
router.post("/", validateCreateBook, bookController.createBook);

// PUT/UPDATE book
router.put("/:id", validateUpdateBook, bookController.updateBook);

// DELETE book
router.delete("/:id", validateBookId, bookController.deleteBook);

module.exports = router;
