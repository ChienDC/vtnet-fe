import React from 'react';
import { Typography } from 'antd';
import ManagementMatrix from '../components/Matrix/ManagementMatrix';

const { Title } = Typography;

const CareerMatrix: React.FC = () => {
  return (
    <div>
      <Title level={2}>Ma trận sự nghiệp</Title>
      <ManagementMatrix />
    </div>
  );
};

export default CareerMatrix;