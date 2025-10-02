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

const menuIconStyle = {
  fontSize: '18px',
  color: '#EF0032',
};

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
      label: 'Lộ trình phát triển cá nhân',
    },
    {
      key: '/career-matrix',
      icon: <FileTextOutlined />,
      label: 'Lộ trình quản lý',
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
        background: '#ffffff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
        borderRight: '1px solid #e5e5e5',
      }}
    >
      <div
        style={{
          height: 64,
          margin: '16px 16px 24px 16px',
          background: 'linear-gradient(135deg, #EF0032 0%, #FF5B82 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(239, 0, 50, 0.3)',
        }}
      >
        {collapsed ? 'VT' : 'VTNET CAREER'}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
          fontWeight: 500,
        }}
      />
    </Sider>
  );
};

export default Sidebar;