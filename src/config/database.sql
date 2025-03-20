-- Buat tabel books jika belum ada
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INT,
  genre VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data awal (akan dijalankan setiap kali aplikasi dimulai)
-- Gunakan DELETE dan INSERT untuk memastikan data tidak terduplikasi
DELETE FROM books WHERE id IN (1, 2, 3);

INSERT INTO books (id, title, author, year, genre) VALUES 
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Novel'),
(2, 'To Kill a Mockingbird', 'Harper Lee', 1960, 'Novel'),
(3, 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 'Fantasy'); 