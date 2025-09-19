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
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { PersonalDevelopmentMatrix, Employee } from '../types';
import { careerAPI, employeeAPI } from '../services/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const DevelopmentMatrix: React.FC = () => {
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<PersonalDevelopmentMatrix[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const employeesData = await employeeAPI.getEmployees();
      setEmployees(employeesData);
      
      // Load development matrices for all employees
      const matricesPromises = employeesData.map(emp => 
        careerAPI.getPersonalDevelopmentMatrix(emp.id)
      );
      const matricesResults = await Promise.all(matricesPromises);
      const validMatrices = matricesResults.filter(matrix => matrix !== null) as PersonalDevelopmentMatrix[];
      setMatrices(validMatrices);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'active';
    if (percentage >= 20) return 'normal';
    return 'exception';
  };

  // Filter matrices
  const filteredMatrices = matrices.filter(matrix => {
    const employee = getEmployee(matrix.employeeId);
    if (!employee) return false;

    const matchesSearch = employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                         employee.employeeCode.toLowerCase().includes(searchText.toLowerCase()) ||
                         matrix.profession.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || matrix.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Calculate statistics
  const stats = {
    total: matrices.length,
    inProgress: matrices.filter(m => {
      const targetPosition = m.positions.find(p => p.status === 'target');
      return targetPosition && targetPosition.progress < 100;
    }).length,
    completed: matrices.filter(m => {
      const targetPosition = m.positions.find(p => p.status === 'target');
      return targetPosition && targetPosition.progress === 100;
    }).length,
    averageProgress: matrices.length > 0 ? Math.round(
      matrices.reduce((sum, m) => {
        const targetPosition = m.positions.find(p => p.status === 'target');
        return sum + (targetPosition ? targetPosition.progress : 0);
      }, 0) / matrices.length
    ) : 0
  };

  const columns: ColumnsType<PersonalDevelopmentMatrix> = [
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
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'profession',
      key: 'profession',
    },
    {
      title: 'Bậc hiện tại',
      dataIndex: 'currentLevel',
      key: 'currentLevel',
      render: (level: string) => (
        <Tag color="blue">{level}</Tag>
      ),
    },
    {
      title: 'Bậc mục tiêu',
      dataIndex: 'targetLevel',
      key: 'targetLevel',
      render: (level: string) => (
        <Tag color="green">{level}</Tag>
      ),
    },
    {
      title: 'Tiến độ mục tiêu',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        const targetPosition = record.positions.find(p => p.status === 'target');
        const progress = targetPosition ? targetPosition.progress : 0;
        return (
          <Progress 
            percent={progress} 
            size="small"
            status={getProgressStatus(progress)}
          />
        );
      },
    },
    {
      title: 'Vị trí hoàn thành',
      key: 'completed',
      render: (_, record) => {
        const completed = record.positions.filter(p => p.status === 'completed').length;
        const total = record.positions.length;
        return (
          <div>
            <span style={{ color: '#52c41a' }}>{completed}</span>
            <span style={{ color: '#666' }}>/{total}</span>
          </div>
        );
      },
    },
    {
      title: 'Cập nhật cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
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
          onClick={() => navigate(`/development-matrix/${record.employeeId}`)}
          title="Xem ma trận"
        />
      ),
    },
  ];

  const departments = Array.from(new Set(matrices.map(m => m.department)));

  return (
    <div>
      <Title level={2}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Ma trận Phát triển Cá nhân
      </Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số ma trận"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang phát triển"
              value={stats.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đạt mục tiêu"
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
              placeholder="Tìm kiếm theo tên nhân viên, mã NV hoặc chuyên môn"
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
              placeholder="Lọc theo phòng ban"
              value={departmentFilter}
              onChange={setDepartmentFilter}
            >
              <Option value="all">Tất cả phòng ban</Option>
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredMatrices}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredMatrices.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} ma trận`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default DevelopmentMatrix;