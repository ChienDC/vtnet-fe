import React from 'react';
import { Typography } from 'antd';
import CareerPathTable from '../components/Career/CareerPathTable';

const { Title } = Typography;

const CareerPaths: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý lộ trình sự nghiệp</Title>
      <CareerPathTable />
    </div>
  );
};

export default CareerPaths;