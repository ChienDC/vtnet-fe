import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: '171.244.199.147',
  port: 3306,
  user: 'verflex123',
  password: 'verflex123',
  database: 'Ver1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Execute query
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  const query = `
    SELECT id, email, password, full_name, phone, role, status, created_at, updated_at 
    FROM users 
    WHERE email = ? AND status = 'active'
  `;
  const results = await executeQuery(query, [email]) as any[];
  return results.length > 0 ? results[0] : null;
};

// Get user by ID
export const getUserById = async (id: number) => {
  const query = `
    SELECT id, email, full_name, phone, role, status, created_at, updated_at 
    FROM users 
    WHERE id = ? AND status = 'active'
  `;
  const results = await executeQuery(query, [id]) as any[];
  return results.length > 0 ? results[0] : null;
};

// Create new user
export const createUser = async (userData: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
}) => {
  const query = `
    INSERT INTO users (email, password, full_name, phone, role, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())
  `;
  const params = [
    userData.email,
    userData.password,
    userData.fullName,
    userData.phone || null,
    userData.role || 'user'
  ];
  
  const result = await executeQuery(query, params) as any;
  return result.insertId;
};

// Update user login time
export const updateUserLoginTime = async (userId: number) => {
  const query = `
    UPDATE users 
    SET last_login_at = NOW(), updated_at = NOW() 
    WHERE id = ?
  `;
  await executeQuery(query, [userId]);
};

// Check if email already exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
  const results = await executeQuery(query, [email]) as any[];
  return results[0].count > 0;
};

// Initialize database tables if they don't exist
export const initializeTables = async (): Promise<boolean> => {
  try {
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('admin', 'manager', 'user') DEFAULT 'user',
        status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await executeQuery(createUsersTable);
    console.log('✅ Users table initialized');

    // Create sessions table for JWT token management
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_token_hash (token_hash),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await executeQuery(createSessionsTable);
    console.log('✅ Sessions table initialized');

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize tables:', error);
    return false;
  }
};

export default pool;