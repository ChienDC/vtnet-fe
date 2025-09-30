// Authentication service for VTNET Career Management System
// Sử dụng MariaDB với fallback localStorage

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Simple password hashing
const hashPassword = (password: string): string => {
  return btoa(password + 'salt');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Generate simple token
const generateToken = (userId: number, email: string): string => {
  const tokenData = {
    userId,
    email,
    timestamp: Date.now()
  };
  return btoa(JSON.stringify(tokenData));
};

const verifyToken = (token: string): { userId: number; email: string } | null => {
  try {
    const tokenData = JSON.parse(atob(token));
    if (Date.now() - tokenData.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }
    return { userId: tokenData.userId, email: tokenData.email };
  } catch {
    return null;
  }
};

// localStorage functions
const getUsersFromStorage = (): User[] => {
  try {
    const usersStr = localStorage.getItem('registeredUsers');
    return usersStr ? JSON.parse(usersStr) : [];
  } catch {
    return [];
  }
};

const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Check if running on Vercel
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

// Temporary flag to disable authentication
const AUTH_DISABLED = true; // Set to true to temporarily disable auth

// Database functions (lazy loading)
let databaseModule: any = null;
let isDatabaseAvailable = false;

const loadDatabaseModule = async () => {
  if (databaseModule) return databaseModule;
  
  try {
    databaseModule = await import('./database');
    isDatabaseAvailable = true;
    console.log('✅ Database module loaded successfully');
    return databaseModule;
  } catch (error) {
    console.log('⚠️ Database module not available, using localStorage fallback');
    isDatabaseAvailable = false;
    return null;
  }
};

// Try to save to database
const trySaveToDatabase = async (userData: RegisterData): Promise<{ success: boolean; user?: User; message: string }> => {
  try {
    const db = await loadDatabaseModule();
    if (!db) {
      return { success: false, message: 'Database not available' };
    }

    const { checkEmailExists, createUser, getUserById } = db;

    // Check if email exists
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Create user
    const hashedPassword = hashPassword(userData.password);
    const userId = await createUser({
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      phone: userData.phone,
      role: 'user'
    });

    // Get created user
    const user = await getUserById(userId);
    if (!user) {
      throw new Error('Failed to get created user');
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      message: 'Đã lưu vào MariaDB'
    };
  } catch (error) {
    console.error('Database save error:', error);
    return { success: false, message: 'Database error' };
  }
};

// Try to login from database
const tryLoginFromDatabase = async (email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
  try {
    const db = await loadDatabaseModule();
    if (!db) {
      return { success: false, message: 'Database not available' };
    }

    const { getUserByEmail, updateUserLoginTime } = db;

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.password) || user.status !== 'active') {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    await updateUserLoginTime(user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      message: 'Đăng nhập thành công từ database'
    };
  } catch (error) {
    console.error('Database login error:', error);
    return { success: false, message: 'Database error' };
  }
};

// Login function
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    // If auth is disabled, return success immediately
    if (AUTH_DISABLED) {
      const mockUser: User = {
        id: 1,
        email: 'admin@vtnet.com',
        fullName: 'Admin User',
        phone: '0123456789',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const token = generateToken(mockUser.id, mockUser.email);
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return {
        success: true,
        message: 'Authentication disabled - Auto login',
        user: mockUser,
        token
      };
    }

    const { email, password } = loginData;

    if (!email || !password) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu'
      };
    }

    // If on Vercel, skip database and use localStorage directly
    if (isVercel) {
      console.log('🌐 Running on Vercel - using localStorage only');
    }

    // Try database first (for local development)
    const dbResult = await tryLoginFromDatabase(email, password);
    if (dbResult.success && dbResult.user) {
      const token = generateToken(dbResult.user.id, dbResult.user.email);

      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(dbResult.user));

      return {
        success: true,
        message: dbResult.message,
        user: dbResult.user,
        token
      };
    }

    // Fallback to localStorage
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
      const { email: regEmail, password: regPassword, user: regUser } = JSON.parse(registeredUser);
      if (regEmail === email && verifyPassword(password, regPassword)) {
        const token = generateToken(regUser.id, regUser.email);

        localStorage.removeItem('registeredUser');
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(regUser));

        return {
          success: true,
          message: 'Đăng nhập thành công',
          user: regUser,
          token
        };
      }
    }

    // Check existing users in localStorage
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      };
    }

    const userPassword = localStorage.getItem(`user_password_${user.id}`);
    if (userPassword && verifyPassword(password, userPassword)) {
      const token = generateToken(user.id, user.email);

      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user,
        token
      };
    }

    return {
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng nhập'
    };
  }
};

// Register function
export const register = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    // If auth is disabled, return success immediately
    if (AUTH_DISABLED) {
      const mockUser: User = {
        id: 1,
        email: 'admin@vtnet.com',
        fullName: 'Admin User',
        phone: '0123456789',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        message: 'Authentication disabled - Registration bypassed',
        user: mockUser
      };
    }

    const { email, password, fullName, phone } = registerData;

    if (!email || !password || !fullName) {
      return {
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Email không đúng định dạng'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      };
    }

    // If on Vercel, skip database and use localStorage directly
    if (isVercel) {
      console.log('🌐 Running on Vercel - using localStorage only');
    }

    // Try database first (for local development)
    const dbResult = await trySaveToDatabase(registerData);
    if (dbResult.success && dbResult.user) {
      return {
        success: true,
        message: `Đăng ký thành công - ${dbResult.message}`,
        user: dbResult.user
      };
    }

    // Fallback to localStorage
    const users = getUsersFromStorage();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return {
        success: false,
        message: 'Email đã được sử dụng'
      };
    }

    const newUser: User = {
      id: Date.now(),
      email,
      fullName,
      phone,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToStorage(users);
    localStorage.setItem(`user_password_${newUser.id}`, hashPassword(password));
    localStorage.setItem('registeredUser', JSON.stringify({
      email,
      password: hashPassword(password),
      user: newUser
    }));

    return {
      success: true,
      message: 'Đăng ký thành công - Lưu tạm thời',
      user: newUser
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký'
    };
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
};

// Get current user from token
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // If auth is disabled, return mock user
    if (AUTH_DISABLED) {
      const mockUser: User = {
        id: 1,
        email: 'admin@vtnet.com',
        fullName: 'Admin User',
        phone: '0123456789',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return mockUser;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const tokenData = verifyToken(token);
    if (!tokenData) {
      logout();
      return null;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      logout();
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    console.error('Get current user error:', error);
    logout();
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  // If auth is disabled, always return true
  if (AUTH_DISABLED) {
    return true;
  }
  
  const token = localStorage.getItem('authToken');
  const isLoggedInFlag = localStorage.getItem('isLoggedIn');
  
  if (!token || !isLoggedInFlag) return false;
  
  const tokenData = verifyToken(token);
  return tokenData !== null;
};

// Get user info from localStorage
export const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};