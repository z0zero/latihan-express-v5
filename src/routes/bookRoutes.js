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
const { upload } = require("../config/uploadConfig");

// PUBLIC ROUTES
// GET all books - Bisa diakses semua orang
router.get("/", bookController.getAllBooks);

// GET book by ID - Bisa diakses semua orang
router.get("/:id", validateBookId, bookController.getBookById);

// GET book cover by ID - Bisa diakses semua orang
router.get("/:id/cover", validateBookId, bookController.getCover);

// PROTECTED ROUTES - Require authentication
// POST new book - Hanya user yang terautentikasi
router.post(
  "/",
  authenticate,
  validateCreateBook,
  upload.single("cover_image"),
  bookController.createBook
);

// PUT/UPDATE book - Hanya user yang terautentikasi
router.put(
  "/:id",
  authenticate,
  validateBookId,
  validateUpdateBook,
  upload.single("cover_image"),
  bookController.updateBook
);

// DELETE book - Hanya admin yang bisa menghapus
router.delete(
  "/:id",
  authenticate,
  checkRole(["admin"]),
  validateBookId,
  bookController.deleteBook
);

// Upload cover image - Hanya user yang terautentikasi
router.post(
  "/:id/cover",
  authenticate,
  validateBookId,
  upload.single("cover_image"),
  bookController.uploadCover
);

// Delete cover image - Hanya user yang terautentikasi
router.delete(
  "/:id/cover",
  authenticate,
  validateBookId,
  bookController.deleteCover
);

module.exports = router;
