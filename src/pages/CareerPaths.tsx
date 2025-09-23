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
  Avatar,
  Typography
} from 'antd';
import { 
  EditOutlined, 
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CareerPath, Employee } from '../types';

const { Title } = Typography;
const { Search } = Input;

const CareerPaths: React.FC = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Mock data
  const mockEmployees: Employee[] = [
    {
      id: '1',
      employeeCode: 'VT001',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@vtnet.vn',
      phone: '0901234567',
      department: 'Công nghệ thông tin',
      position: 'Kỹ sư phần mềm',
      level: 'Bậc 12',
      joinDate: '2022-01-15',
      status: 'active',
      manager: 'Trần Văn B',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      certifications: [
        {
          id: '1',
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023-06-15',
          expiryDate: '2026-06-15',
          status: 'active'
        }
      ],
      careerPath: {
        id: '1',
        employeeId: '1',
        currentLevel: 'Bậc 12',
        targetLevel: 'Bậc 14',
        department: 'Công nghệ thông tin',
        profession: 'Phát triển phần mềm',
        progressPercentage: 65,
        milestones: [
          {
            id: '1',
            title: 'Hoàn thành khóa học Leadership',
            description: 'Tham gia và hoàn thành khóa học quản lý lãnh đạo',
            targetDate: '2024-06-30',
            status: 'completed',
            completedDate: '2024-05-15',
            requirements: ['Tham gia khóa học', 'Đạt điểm tối thiểu 80%'],
            progress: 100
          },
          {
            id: '2',
            title: 'Dẫn dắt dự án lớn',
            description: 'Làm team lead cho dự án có quy mô > 5 người',
            targetDate: '2024-12-31',
            status: 'in_progress',
            requirements: ['Quản lý team 5+ người', 'Hoàn thành dự án đúng hạn'],
            progress: 40
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-20'
      }
    },
    {
      id: '2',
      employeeCode: 'VT002',
      fullName: 'Trần Thị Bình',
      email: 'binh.tran@vtnet.vn',
      phone: '0901234568',
      department: 'Quản lý tác động',
      position: 'Chuyên viên quản lý thay đổi',
      level: 'Bậc 11',
      joinDate: '2023-03-10',
      status: 'active',
      manager: 'Lê Văn C',
      skills: ['Project Management', 'Change Management', 'ITIL'],
      certifications: [
        {
          id: '2',
          name: 'PMP Certification',
          issuer: 'PMI',
          issueDate: '2023-09-20',
          expiryDate: '2026-09-20',
          status: 'active'
        }
      ],
      careerPath: {
        id: '2',
        employeeId: '2',
        currentLevel: 'Bậc 11',
        targetLevel: 'Bậc 13',
        department: 'Quản lý tác động',
        profession: 'Quản lý thay đổi',
        progressPercentage: 30,
        milestones: [
          {
            id: '3',
            title: 'Chứng chỉ ITIL Foundation',
            description: 'Lấy chứng chỉ ITIL Foundation',
            targetDate: '2024-08-31',
            status: 'pending',
            requirements: ['Tham gia khóa học ITIL', 'Thi đạt chứng chỉ'],
            progress: 0
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-20'
      }
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployees(mockEmployees);
      setCareerPaths(mockEmployees.map(emp => emp.careerPath));
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
      <Title level={2}>Quản lý lộ trình sự nghiệp</Title>
      
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

export default CareerPaths;