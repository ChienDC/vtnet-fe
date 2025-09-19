import React from 'react';
import { Typography } from 'antd';
import DepartmentTable from '../components/Department/DepartmentTable';

const { Title } = Typography;

const Departments: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý phòng ban</Title>
      <DepartmentTable />
    </div>
  );
};

export default Departments;