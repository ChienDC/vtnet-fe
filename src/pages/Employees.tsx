import React from 'react';
import { Typography, Tabs } from 'antd';
import EmployeeTable from '../components/Employee/EmployeeTable';
import CriteriaManagement from '../components/Employee/CriteriaManagement';

const { Title } = Typography;
const { TabPane } = Tabs;

const Employees: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý nhân viên</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách nhân viên" key="1">
          <EmployeeTable />
        </TabPane>
        <TabPane tab="Tiêu chí đánh giá" key="2">
          <CriteriaManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Employees;