import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Table, Tag, Spin } from 'antd';
import { 
  UserOutlined, 
  RiseOutlined, 
  CheckCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import { dashboardAPI, employeeAPI } from '../services/api';
import { DashboardStats, Employee } from '../types';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, employeesData] = await Promise.all([
        dashboardAPI.getStats(),
        employeeAPI.getEmployees()
      ]);
      
      setStats(statsData);
      setRecentEmployees(employeesData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentEmployeesColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Tiến độ sự nghiệp',
      dataIndex: 'careerPath',
      key: 'progress',
      render: (careerPath: any) => (
        <Progress 
          percent={careerPath.progressPercentage} 
          size="small" 
          status={careerPath.progressPercentage > 70 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="fade-in" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column'
      }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#EF0032' }} spin />} 
          size="large" 
        />
        <div style={{ marginTop: 16, fontSize: '16px', color: '#666' }}>
          Đang tải dữ liệu dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Title level={2}>Dashboard - Hệ thống Quản lý Sự nghiệp VTNET</Title>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="stat-card bg-illustration-1">
            <div className="stat-card-content">
            <Statistic
              title="Tổng số nhân viên"
              value={stats?.totalEmployees || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#EF0032', fontWeight: 'bold', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontWeight: '500' }}
            />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-2">
            <div className="stat-card-content">
            <Statistic
              title="Lộ trình đang thực hiện"
              value={stats?.activeCareerPaths || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#176FEE', fontWeight: 'bold', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontWeight: '500' }}
            />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-3">
            <div className="stat-card-content">
            <Statistic
              title="Mục tiêu đã hoàn thành"
              value={stats?.completedMilestones || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#489242', fontWeight: 'bold', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontWeight: '500' }}
            />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-4">
            <div className="stat-card-content">
            <Statistic
              title="Chứng chỉ chờ duyệt"
              value={stats?.pendingCertifications || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#028599', fontWeight: 'bold', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontWeight: '500' }}
            />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Thống kê theo phòng ban" className="modern-card slide-up">
            {stats?.departmentStats.map((dept, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>{dept.department}</span>
                  <span style={{ color: '#6b7280' }}>{dept.employeeCount} nhân viên</span>
                </div>
                <Progress 
                  className="modern-progress"
                  percent={dept.averageProgress} 
                  status="active"
                  format={percent => `${percent}% tiến độ TB`}
                  strokeColor={{
                    '0%': '#EF0032',
                    '100%': '#d10029',
                  }}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Nhân viên mới nhất" className="modern-card slide-up">
            <Table
              className="modern-table"
              columns={recentEmployeesColumns}
              dataSource={recentEmployees}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;