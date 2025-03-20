/**
 * Book Routes
 */
const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// GET all books
router.get("/", bookController.getAllBooks);

// GET book by ID
router.get("/:id", bookController.getBookById);

// POST new book
router.post("/", bookController.createBook);

// PUT/UPDATE book
router.put("/:id", bookController.updateBook);

// DELETE book
router.delete("/:id", bookController.deleteBook);

module.exports = router;
