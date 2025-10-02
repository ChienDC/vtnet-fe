import React from 'react';

const EnvCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff4d4f', marginBottom: '20px' }}>
            ⚠️ Thiếu Environment Variables
          </h1>
          
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Ứng dụng cần các environment variables sau để hoạt động:
          </p>

          <div style={{ 
            textAlign: 'left', 
            backgroundColor: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '4px',
            marginBottom: '20px',
            fontFamily: 'monospace'
          }}>
            <div><strong>VITE_SUPABASE_URL:</strong> {supabaseUrl || '❌ Chưa có'}</div>
            <div><strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseKey ? '✅ Có' : '❌ Chưa có'}</div>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <h3>Hướng dẫn cấu hình Vercel:</h3>
            <ol>
              <li>Vào Vercel Dashboard → Project Settings</li>
              <li>Chọn tab "Environment Variables"</li>
              <li>Thêm các biến sau:</li>
              <ul>
                <li><code>VITE_SUPABASE_URL</code> = URL Supabase project của bạn</li>
                <li><code>VITE_SUPABASE_ANON_KEY</code> = Anon key từ Supabase</li>
              </ul>
              <li>Redeploy project</li>
            </ol>
          </div>

          <div style={{ 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>💡 Lưu ý:</strong> Các environment variables phải bắt đầu với <code>VITE_</code> 
            để Vite có thể truy cập được trong browser.
          </div>

          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tải lại sau khi cấu hình
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnvCheck;
