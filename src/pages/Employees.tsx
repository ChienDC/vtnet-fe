import React from 'react';
import { Typography, Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import EmployeeTable from '../components/Employee/EmployeeTable';
import CriteriaManagement from '../components/Employee/CriteriaManagement';

const { Title } = Typography;
const { TabPane } = Tabs;

const Employees: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || '1';

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  return (
    <div>
      <Title level={2}>Quản lý nhân viên</Title>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
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