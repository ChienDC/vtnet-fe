import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu'
      });
    }

    // For Vercel deployment, we'll use a simple response
    // In production, you should connect to your database here
    const mockUser = {
      id: 1,
      email,
      fullName: 'Test User',
      phone: '',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công - Vercel API',
      user: mockUser,
      token: 'vercel-mock-token'
    });

  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đăng nhập'
    });
  }
}
