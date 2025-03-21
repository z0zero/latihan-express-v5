-- Buat tabel books jika belum ada
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INT,
  genre VARCHAR(100),
  cover_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buat tabel users jika belum ada
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data awal untuk buku dengan ON DUPLICATE KEY UPDATE
-- Memperbarui data tapi tetap mempertahankan cover_image
INSERT INTO books (id, title, author, year, genre) VALUES 
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Novel'),
(2, 'To Kill a Mockingbird', 'Harper Lee', 1960, 'Novel'),
(3, 'Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 'Fantasy')
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  author = VALUES(author),
  year = VALUES(year),
  genre = VALUES(genre);

-- Insert admin user untuk testing (akan dieksekusi sekali)
-- Password: Password123 (bcrypt hash akan berbeda setiap kali)
INSERT IGNORE INTO users (name, email, password, role) VALUES 
('Admin', 'admin@example.com', '$2b$10$0EuLiMLKKoFptfJEYPwuU.WQW9Stuy87lWAF6Ij0vRaRVv/OkeIcC', 'admin'); 