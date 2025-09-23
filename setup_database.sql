-- Script tạo bảng users cho VTNET Career Management System
-- Chạy script này trong MySQL Workbench với database Ver1

USE Ver1;

-- Tạo bảng users nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

-- Kiểm tra bảng đã được tạo
DESCRIBE users;

-- Kiểm tra dữ liệu hiện tại
SELECT * FROM users;
