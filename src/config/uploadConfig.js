/**
 * Upload Config - Konfigurasi untuk upload file
 */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Definisikan lokasi penyimpanan file upload
const UPLOAD_PATH = path.join(process.cwd(), "public", "uploads");
const COVERS_PATH = path.join(UPLOAD_PATH, "covers");

// Pastikan direktori upload ada
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

if (!fs.existsSync(COVERS_PATH)) {
  fs.mkdirSync(COVERS_PATH, { recursive: true });
}

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, COVERS_PATH);
  },
  filename: function (req, file, cb) {
    // Format filename: timestamp-bookid-originalname
    // Gunakan bookId jika ada, jika tidak gunakan 'new'
    const bookId = req.params.id || "new";
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);

    cb(null, `${timestamp}-${bookId}${extension}`);
  },
});

// Filter file untuk membatasi hanya file gambar yang diterima
const fileFilter = (req, file, cb) => {
  // Periksa apakah mime type adalah image/jpeg atau image/png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya file gambar (jpg, jpeg, dan png) yang diperbolehkan!"),
      false
    );
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Fungsi untuk menghapus file cover lama
const deleteCoverImage = async (filePath) => {
  try {
    // Jika filePath tidak ada atau tidak lengkap, abaikan
    if (!filePath) return;

    let fullPath;

    // Jika filePath adalah path lengkap
    if (filePath.includes(path.sep)) {
      fullPath = filePath;
    }
    // Jika filePath hanya nama file
    else {
      fullPath = path.join(COVERS_PATH, filePath);
    }

    // Hanya hapus file jika ada
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Cover image deleted: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting cover image: ${error.message}`);
  }
};

module.exports = {
  upload,
  deleteCoverImage,
  UPLOAD_PATH,
  COVERS_PATH,
};
