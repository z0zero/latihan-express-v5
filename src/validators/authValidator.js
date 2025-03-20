/**
 * Auth Validator
 */
const { body } = require("express-validator");
const { validate } = require("./index");

// Validasi untuk registrasi user
const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isString()
    .withMessage("Nama harus berupa teks")
    .isLength({ min: 3, max: 100 })
    .withMessage("Nama harus memiliki 3-100 karakter"),

  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .matches(/\d/)
    .withMessage("Password harus mengandung setidaknya 1 angka")
    .matches(/[a-zA-Z]/)
    .withMessage("Password harus mengandung setidaknya 1 huruf"),

  validate,
];

// Validasi untuk login user
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password wajib diisi"),

  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
};
