import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Tag,
  Input,
  Card,
  Row,
  Col,
  Progress,
  Avatar
} from 'antd';
import { 
  EditOutlined, 
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CareerPath, Employee } from '../../types';
import { careerAPI, employeeAPI } from '../../services/api';

const { Search } = Input;

const CareerPathTable: React.FC = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [careerData, employeeData] = await Promise.all([
        careerAPI.getCareerPaths(),
        employeeAPI.getEmployees()
      ]);
      setCareerPaths(careerData);
      setEmployees(employeeData);
    } catch (error) {
      message.error('Không thể tải dữ liệu lộ trình sự nghiệp');
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const handleExport = () => {
    message.success('Xuất Excel thành công');
  };

  // Filter career paths based on search
  const filteredCareerPaths = careerPaths.filter(careerPath => {
    const employee = getEmployee(careerPath.employeeId);
    if (!employee) return false;
    
    return employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
           employee.employeeCode.toLowerCase().includes(searchText.toLowerCase()) ||
           careerPath.department.toLowerCase().includes(searchText.toLowerCase()) ||
           careerPath.profession.toLowerCase().includes(searchText.toLowerCase());
  });

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'active';
    if (percentage >= 20) return 'normal';
    return 'exception';
  };

  // Table columns definition
  const columns: ColumnsType<CareerPath> = [
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
      title: 'Số mục tiêu',
      key: 'milestones',
      render: (_, record) => {
        const completed = record.milestones.filter(m => m.status === 'completed').length;
        const total = record.milestones.length;
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
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
          />
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            title="Chỉnh sửa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên nhân viên, phòng ban hoặc chuyên môn"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Xuất báo cáo
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredCareerPaths}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredCareerPaths.length,
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

export default CareerPathTable;