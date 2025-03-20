# Models

Direktori ini berisi model domain yang merepresentasikan entitas di aplikasi.

## Struktur Model

Model domain biasanya berisi:

1. Definisi struktur data (skema)
2. Konstanta terkait model (nama tabel, nama kolom)
3. Fungsi utilitas untuk validasi dan transformasi data
4. Metode bisnis terkait dengan entitas tersebut

Model **tidak** seharusnya berisi logika akses data (CRUD operations). Logika ini ada di repository.

## Book Model

Model `Book` merepresentasikan entitas buku dalam aplikasi, yang disimpan dalam tabel 'books' pada database.

### Skema

- `id`: Primary key, auto-incremented
- `title`: Judul buku (wajib)
- `author`: Penulis buku (wajib)
- `year`: Tahun terbit (opsional)
- `genre`: Genre buku (opsional)

### Penggunaan

Model Book dapat digunakan sebagai berikut:

```javascript
const { Book } = require("../models");

// Menggunakan konstanta tabel dan kolom
console.log(Book.TABLE_NAME); // 'books'
console.log(Book.COLUMNS.TITLE); // 'title'

// Validasi data buku
const bookData = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  year: 1925,
  genre: "Novel",
};

const validation = Book.validate(bookData);
if (validation.isValid) {
  console.log("Data buku valid");
} else {
  console.log("Error validasi:", validation.errors);
}

// Mengkonversi data dari database ke objek model
const dbRow = {
  id: 1,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  year: 1925,
  genre: "Novel",
};

const bookModel = Book.fromDbRow(dbRow);
console.log(bookModel);
```

## Pengaksesan Data

Untuk operasi database seperti pencarian, pembuatan, pembaruan, dan penghapusan buku, gunakan `BookRepository` dari direktori repositories.

```javascript
const { BookRepository } = require("../models");

// Mengambil buku berdasarkan ID
const book = await BookRepository.findById(1);
```

## Pemisahan Model dan Repository

Pemisahan ini menerapkan prinsip "Separation of Concerns", dimana:

1. **Model** bertanggung jawab untuk mendefinisikan struktur data dan validasi
2. **Repository** bertanggung jawab untuk akses data dan interaksi dengan database

Pendekatan ini memudahkan:

- Unit testing
- Perubahan implementasi database tanpa mengubah model
- Pengelolaan kode dengan lebih terstruktur
