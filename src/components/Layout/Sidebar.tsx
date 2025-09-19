import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  RiseOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa menu items
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/employees',
      icon: <UserOutlined />,
      label: 'Quản lý nhân viên',
    },
    {
      key: '/career-paths',
      icon: <RiseOutlined />,
      label: 'Lộ trình sự nghiệp',
    },
    {
      key: '/personal-tracking',
      icon: <RiseOutlined />,
      label: 'Lộ trình cá nhân',
    },
    {
      key: '/career-roadmap',
      icon: <FileTextOutlined />,
      label: 'Lộ trình nghề nghiệp',
    },
    {
      key: '/development-matrix',
      icon: <FileTextOutlined />,
      label: 'Ma trận phát triển cá nhân',
    },
    {
      key: '/career-matrix',
      icon: <FileTextOutlined />,
      label: 'Ma trận quản lý',
    },
    {
      key: '/departments',
      icon: <ApartmentOutlined />,
      label: 'Phòng ban',
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: 'Upload file',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className="modern-sidebar"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div 
        style={{ 
          height: 32, 
          margin: 16, 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {collapsed ? 'VTNET' : 'VTNET CAREER'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
        }}
      />
    </Sider>
  );
};

export default Sidebar;