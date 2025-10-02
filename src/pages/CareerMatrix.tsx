import React from 'react';
import { Typography } from 'antd';
import ManagementMatrix from '../components/Matrix/ManagementMatrix';
import SimpleMatrix from '../components/Matrix/SimpleMatrix';
import { hasValidSupabaseConfig } from '../lib/supabase';

const { Title } = Typography;

const CareerMatrix: React.FC = () => {
  // Sử dụng SimpleMatrix nếu không có Supabase config
  if (!hasValidSupabaseConfig()) {
    return <SimpleMatrix />;
  }

  return (
    <div>
      <Title level={2}>Lộ trình sự nghiệp</Title>
      <ManagementMatrix />
    </div>
  );
};

export default CareerMatrix;