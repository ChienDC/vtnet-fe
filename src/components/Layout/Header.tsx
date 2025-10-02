import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const routeNames: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/employees': 'Quản lý nhân viên',
  '/career-paths': 'Lộ trình sự nghiệp',
  '/personal-tracking': 'Lộ trình cá nhân',
  '/career-roadmap': 'Lộ trình nghề nghiệp',
  '/development-matrix': 'Lộ trình phát triển cá nhân',
  '/career-matrix': 'Lộ trình quản lý',
  '/departments': 'Phòng ban',
  '/upload': 'Upload file',
  '/settings': 'Cài đặt',
};

// Mapping cho breadcrumb với tên trang cụ thể
const breadcrumbMapping: { [key: string]: { parent: string; current: string } } = {
  '/employees': { parent: 'Quản lý nhân viên', current: 'Danh sách nhân viên' },
  '/career-paths': { parent: 'Lộ trình sự nghiệp', current: 'Danh sách lộ trình' },
  '/departments': { parent: 'Phòng ban', current: 'Danh sách phòng ban' },
  '/personal-tracking': { parent: 'Lộ trình cá nhân', current: 'Theo dõi cá nhân' },
  '/career-roadmap': { parent: 'Lộ trình nghề nghiệp', current: 'Danh sách nghề nghiệp' },
  '/development-matrix': { parent: 'Lộ trình phát triển cá nhân', current: 'Danh sách lộ trình phát triển' },
  '/career-matrix': { parent: 'Lộ trình quản lý', current: 'Danh sách lộ trình quản lý' },
  '/upload': { parent: 'Tải lên', current: 'Upload file' },
  '/settings': { parent: 'Hệ thống', current: 'Cài đặt' },
};

// Mapping cho các tab trong trang
const tabMapping: { [key: string]: { [tabKey: string]: string } } = {
  '/employees': {
    '1': 'Danh sách nhân viên',
    '2': 'Tiêu chí đánh giá',
  },
};

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const searchParams = new URLSearchParams(location.search);
    const breadcrumbItems = [
      {
        title: <Link to="/dashboard">Trang chủ</Link>,
      },
    ];

    if (pathSnippets.length > 0) {
      const currentPath = '/' + pathSnippets.join('/');
      
      // Kiểm tra xem có mapping breadcrumb không
      const breadcrumbInfo = breadcrumbMapping[currentPath];
      
      if (breadcrumbInfo) {
        // Thêm parent breadcrumb (có thể click)
        breadcrumbItems.push({
          title: <Link to={currentPath}>{breadcrumbInfo.parent}</Link>,
        });
        
        // Kiểm tra xem có tab parameter không
        const tabKey = searchParams.get('tab');
        const tabInfo = tabMapping[currentPath];
        
        if (tabKey && tabInfo && tabInfo[tabKey]) {
          // Nếu có tab, hiển thị tên tab thay vì tên mặc định
          breadcrumbItems.push({
            title: <span>{tabInfo[tabKey]}</span>,
          });
        } else {
          // Thêm current page (không có link)
          breadcrumbItems.push({
            title: <span>{breadcrumbInfo.current}</span>,
          });
        }
      } else if (pathSnippets.length === 1) {
        // Trường hợp route đơn giản không có mapping
        const title = routeNames[currentPath] || pathSnippets[pathSnippets.length - 1];
        breadcrumbItems.push({
          title: <span>{title}</span>,
        });
      } else {
        // Trường hợp dynamic routes như /employees/123
        pathSnippets.forEach((snippet, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSnippets.length - 1;
          
          let title;
          
          // Xử lý dynamic ID
          if (snippet.match(/^\d+$/)) {
            const parentPath = `/${pathSnippets.slice(0, index).join('/')}`;
            const mode = searchParams.get('mode');
            
            if (parentPath === '/employees') {
              title = mode === 'edit' ? 'Chỉnh sửa nhân viên' : 'Chi tiết nhân viên';
            } else if (parentPath === '/personal-tracking') {
              title = mode === 'edit' ? 'Chỉnh sửa theo dõi' : 'Chi tiết theo dõi';
            } else if (parentPath === '/career-roadmap') {
              title = mode === 'edit' ? 'Chỉnh sửa lộ trình' : 'Chi tiết lộ trình';
            } else if (parentPath === '/development-matrix') {
              title = mode === 'edit' ? 'Chỉnh sửa phát triển' : 'Chi tiết phát triển';
            } else {
              title = mode === 'edit' ? 'Chỉnh sửa' : 'Chi tiết';
            }
          } else {
            // Lấy tên từ breadcrumbMapping hoặc routeNames
            const breadcrumbInfo = breadcrumbMapping[url];
            if (breadcrumbInfo) {
              // Nếu không phải item cuối, thêm parent
              if (!isLast) {
                breadcrumbItems.push({
                  title: <Link to={url}>{breadcrumbInfo.parent}</Link>,
                });
              }
              title = breadcrumbInfo.current;
            } else {
              title = routeNames[url] || snippet.charAt(0).toUpperCase() + snippet.slice(1).replace(/-/g, ' ');
            }
          }
          
          if (title) {
            breadcrumbItems.push({
              title: isLast ? <span>{title}</span> : <Link to={url}>{title}</Link>,
            });
          }
        });
      }
    }

    return breadcrumbItems;
  };

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
        console.log('Đăng xuất');
        break;
      case 'profile':
        console.log('Xem profile');
        break;
      case 'settings':
        console.log('Cài đặt');
        break;
    }
  };

  return (
    <AntHeader
      className="modern-header"
      style={{
        padding: 0,
        background: '#fff',
        borderBottom: '1px solid #e8edf2',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{
              fontSize: '18px',
              width: 64,
              height: 64,
              transition: 'all 0.3s ease',
              color: '#EF0032',
            }}
          />
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ marginLeft: 16, fontSize: '14px' }}
          />
        </div>

        <Space style={{ marginRight: 24 }}>
          <Text style={{ fontWeight: 500, color: '#374151' }}>Xin chào, Admin</Text>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick
            }}
            trigger={['click']}
          >
            <Avatar
              style={{
                background: 'linear-gradient(135deg, #EF0032 0%, #FF5B82 100%)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 0, 50, 0.3)',
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;