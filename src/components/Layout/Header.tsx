import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { logout, getUserFromStorage } from '../../services/authService';
import { message } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  // Menu dropdown cho user
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        console.log('Xem profile');
        break;
      case 'settings':
        console.log('Cài đặt');
        break;
    }
  };

  const handleLogout = () => {
    logout();
    message.success('Đăng xuất thành công');
    window.location.href = '/auth';
  };

  // Get user info from localStorage
  const user = getUserFromStorage();
  const userName = user?.fullName || user?.email || 'Admin';

  return (
    <AntHeader 
      className="modern-header"
      style={{ 
        padding: 0, 
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e5e5',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
          borderRadius: '12px',
          transition: 'all 0.3s ease',
        }}
        className="hover:bg-red-50"
      />
      
      <Space style={{ marginRight: 24 }}>
        <Text style={{ fontWeight: 500, color: '#374151' }}>Xin chào, {userName}</Text>
        <Dropdown 
          menu={{ 
            items: userMenuItems,
            onClick: handleUserMenuClick 
          }} 
          trigger={['click']}
        >
          <Avatar 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }} 
            icon={<UserOutlined />} 
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;