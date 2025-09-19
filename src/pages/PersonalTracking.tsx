import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Table, 
  Progress, 
  Tag, 
  Button, 
  Input, 
  Select,
  Space,
  Avatar,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  SearchOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { PersonalCareerTrack, Employee } from '../types';
import { careerAPI, employeeAPI } from '../services/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const PersonalTracking: React.FC = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<PersonalCareerTrack[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tracksData, employeesData] = await Promise.all([
        careerAPI.getPersonalCareerTracks(),
        employeeAPI.getEmployees()
      ]);
      setTracks(tracksData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'processing';
      case 'planning': return 'default';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang thực hiện';
      case 'planning': return 'Lập kế hoạch';
      case 'paused': return 'Tạm dừng';
      default: return status;
    }
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'active';
    if (percentage >= 20) return 'normal';
    return 'exception';
  };

  // Filter tracks
  const filteredTracks = tracks.filter(track => {
    const employee = getEmployee(track.employeeId);
    if (!employee) return false;

    const matchesSearch = employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                         employee.employeeCode.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || track.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: tracks.length,
    inProgress: tracks.filter(t => t.status === 'in_progress').length,
    completed: tracks.filter(t => t.status === 'completed').length,
    planning: tracks.filter(t => t.status === 'planning').length,
    averageProgress: tracks.length > 0 ? Math.round(tracks.reduce((sum, t) => sum + t.progressPercentage, 0) / tracks.length) : 0
  };

  const columns: ColumnsType<PersonalCareerTrack> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nhân viên',
      key: 'employee',
      width: 200,
      render: (_, record) => {
        const employee = getEmployee(record.employeeId);
        if (!employee) return 'N/A';
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              src={employee.avatar}
              style={{ marginRight: 12 }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{employee.fullName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{employee.employeeCode}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Vị trí hiện tại → Mục tiêu',
      key: 'positions',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color="blue">Hiện tại: Position {record.currentPositionId}</Tag>
          </div>
          <div>
            <Tag color="green">Mục tiêu: Position {record.targetPositionId}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'timeline',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Bắt đầu: {new Date(record.startDate).toLocaleDateString('vi-VN')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Dự kiến: {new Date(record.expectedCompletionDate).toLocaleDateString('vi-VN')}
          </div>
          {record.actualCompletionDate && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Hoàn thành: {new Date(record.actualCompletionDate).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress 
          percent={record.progressPercentage} 
          size="small"
          status={getProgressStatus(record.progressPercentage)}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Bước thực hiện',
      key: 'steps',
      render: (_, record) => {
        const completed = record.trackingSteps.filter(s => s.status === 'completed').length;
        const total = record.trackingSteps.length;
        return (
          <div>
            <span style={{ color: '#52c41a' }}>{completed}</span>
            <span style={{ color: '#666' }}>/{total}</span>
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/personal-tracking/${record.employeeId}`)}
          title="Xem chi tiết"
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <RiseOutlined style={{ marginRight: 8 }} />
        Theo dõi Lộ trình Phát triển Cá nhân
      </Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số lộ trình"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={stats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tiến độ trung bình"
              value={stats.averageProgress}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên nhân viên hoặc mã NV"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="planning">Lập kế hoạch</Option>
              <Option value="in_progress">Đang thực hiện</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="paused">Tạm dừng</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTracks}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredTracks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} lộ trình`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default PersonalTracking;