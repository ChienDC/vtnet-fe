import React from 'react';
import { Card, Typography, Alert } from 'antd';

const { Title, Text } = Typography;

const SimpleMatrix: React.FC = () => {
  return (
    <div>
      <Title level={2}>Lộ trình quản lý</Title>
      
      <Alert
        message="Chế độ Demo"
        description="Tính năng này cần cấu hình Supabase để hoạt động đầy đủ. Hiện tại đang chạy ở chế độ demo."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card title="Ma trận phát triển nghề nghiệp" className="modern-card">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          minHeight: '400px',
          padding: '20px'
        }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px'
              }}
            >
              <Text type="secondary">Ô {i + 1}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SimpleMatrix;
