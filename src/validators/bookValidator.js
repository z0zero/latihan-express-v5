/**
 * Book Validator
 */
const { body, param } = require("express-validator");
const { validate } = require("./index");

// Validasi untuk membuat buku baru
const validateCreateBook = [
  body("title")
    .notEmpty()
    .withMessage("Judul buku wajib diisi")
    .isString()
    .withMessage("Judul buku harus berupa teks")
    .isLength({ min: 2, max: 255 })
    .withMessage("Judul buku harus memiliki 2-255 karakter"),

  body("author")
    .notEmpty()
    .withMessage("Penulis buku wajib diisi")
    .isString()
    .withMessage("Penulis buku harus berupa teks")
    .isLength({ min: 2, max: 255 })
    .withMessage("Penulis buku harus memiliki 2-255 karakter"),

  body("year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Tahun harus berupa angka antara 1000 dan ${new Date().getFullYear()}`
    ),

  body("genre")
    .optional()
    .isString()
    .withMessage("Genre buku harus berupa teks")
    .isLength({ min: 2, max: 100 })
    .withMessage("Genre buku harus memiliki 2-100 karakter"),

  body("cover_image")
    .optional()
    .isString()
    .withMessage("Cover image harus berupa path string"),

  validate,
];

// Validasi untuk mengupdate buku
const validateUpdateBook = [
  param("id")
    .notEmpty()
    .withMessage("ID buku wajib diisi")
    .isInt({ min: 1 })
    .withMessage("ID buku harus berupa angka positif"),

  body("title")
    .optional()
    .isString()
    .withMessage("Judul buku harus berupa teks")
    .isLength({ min: 2, max: 255 })
    .withMessage("Judul buku harus memiliki 2-255 karakter"),

  body("author")
    .optional()
    .isString()
    .withMessage("Penulis buku harus berupa teks")
    .isLength({ min: 2, max: 255 })
    .withMessage("Penulis buku harus memiliki 2-255 karakter"),

  body("year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Tahun harus berupa angka antara 1000 dan ${new Date().getFullYear()}`
    ),

  body("genre")
    .optional()
    .isString()
    .withMessage("Genre buku harus berupa teks")
    .isLength({ min: 2, max: 100 })
    .withMessage("Genre buku harus memiliki 2-100 karakter"),

  body("cover_image")
    .optional()
    .isString()
    .withMessage("Cover image harus berupa path string"),

  validate,
];

// Validasi ID buku untuk operasi get, update, delete
const validateBookId = [
  param("id")
    .notEmpty()
    .withMessage("ID buku wajib diisi")
    .isInt({ min: 1 })
    .withMessage("ID buku harus berupa angka positif"),

  validate,
];

module.exports = {
  validateCreateBook,
  validateUpdateBook,
  validateBookId,
};
