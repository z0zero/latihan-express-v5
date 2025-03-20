# Repositories

Direktori ini berisi repository classes yang berfungsi untuk menangani operasi ke database. Repository bertindak sebagai perantara antara model domain dan layer data, dan bertanggung jawab untuk mengambil data dari satu atau lebih sumber dan memetakannya ke model domain.

## Struktur

Repository mengikuti pola Single Responsibility Principle, dimana masing-masing repository hanya bertanggung jawab untuk satu jenis entitas.

## BookRepository

`BookRepository` menyediakan operasi CRUD (Create, Read, Update, Delete) untuk entitas Book.

### Penggunaan

```javascript
const { BookRepository } = require("../models");

// Mengambil semua buku
const getAllBooks = async () => {
  try {
    const books = await BookRepository.findAll();
    return books;
  } catch (error) {
    // Handle error
  }
};

// Mengambil buku berdasarkan ID
const getBookById = async (id) => {
  try {
    const book = await BookRepository.findById(id);
    return book;
  } catch (error) {
    // Handle error
  }
};

// Membuat buku baru
const createBook = async (bookData) => {
  try {
    const newBook = await BookRepository.create(bookData);
    return newBook;
  } catch (error) {
    // Handle error
  }
};

// Memperbarui buku
const updateBook = async (id, bookData) => {
  try {
    const updatedBook = await BookRepository.update(id, bookData);
    return updatedBook;
  } catch (error) {
    // Handle error
  }
};

// Menghapus buku
const deleteBook = async (id) => {
  try {
    const result = await BookRepository.delete(id);
    return result;
  } catch (error) {
    // Handle error
  }
};

// Mencari buku berdasarkan kriteria
const searchBooks = async (criteria) => {
  try {
    const books = await BookRepository.findByCriteria(criteria);
    return books;
  } catch (error) {
    // Handle error
  }
};
```

## Kenapa Menggunakan Repository Pattern?

1. **Separation of Concern**: Memisahkan logika bisnis dari logika akses data
2. **Testability**: Memudahkan unit testing dengan mocking repository
3. **Maintainability**: Lebih mudah untuk mempertahankan dan mengembangkan kode
4. **Reusability**: Operasi yang sama dapat digunakan ulang di berbagai tempat
5. **Abstraction**: Menyembunyikan kompleksitas query database

## Kompatibilitas dengan Kode Lama

Untuk mempertahankan kompatibilitas dengan kode yang sudah ada, modul `index.js` di direktori models mengekspor `LegacyBook` yang merujuk ke `BookRepository`. Jadi jika ada kode lama yang mengimpor `Book` dari `models/Book.js`, kode tersebut masih akan berfungsi dengan menggunakan `require('../models').LegacyBook` sebagai gantinya.
