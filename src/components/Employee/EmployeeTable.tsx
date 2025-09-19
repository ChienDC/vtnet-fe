import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Tag,
  Input,
  Card,
  Row,
  Col,
  Avatar,
  Progress
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
  UploadOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Employee } from '../../types';
import { employeeAPI } from '../../services/api';
import EmployeeModal from './EmployeeModal';
import ExcelImportModal from './ExcelImportModal';
import ExcelExportModal from './ExcelExportModal';

const { Search } = Input;

const EmployeeTable: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeAPI.getEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await employeeAPI.deleteEmployee(id);
      message.success('Xóa nhân viên thành công');
      loadEmployees();
    } catch (error) {
      message.error('Không thể xóa nhân viên');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const handleView = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingEmployee(null);
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setEditingEmployee(null);
    loadEmployees();
  };

  const handleExport = () => {
    setExportModalVisible(true);
  };

  const handleImport = () => {
    setImportModalVisible(true);
  };

  const handleImportSuccess = async (importedEmployees: Employee[]) => {
    try {
      // In a real app, you would call API to save imported employees
      // For demo, we'll just add them to the current list
      setEmployees(prev => [...prev, ...importedEmployees]);
      message.success(`Đã import thành công ${importedEmployees.length} nhân viên`);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu import');
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.employeeCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'on_leave': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang làm việc';
      case 'inactive': return 'Nghỉ việc';
      case 'on_leave': return 'Nghỉ phép';
      default: return status;
    }
  };

  // Table columns definition
  const columns: ColumnsType<Employee> = [
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
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            src={record.avatar}
            style={{ marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.fullName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.employeeCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Bậc',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color="blue">{level}</Tag>
      ),
    },
    {
      title: 'Tiến độ sự nghiệp',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress 
          percent={record.careerPath.progressPercentage} 
          size="small"
          status={record.careerPath.progressPercentage > 70 ? 'success' : 'active'}
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
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <Card className="modern-card">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên, mã NV, email hoặc phòng ban"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ borderRadius: '12px' }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                className="btn-primary"
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm nhân viên
              </Button>
              <Button
                className="btn-secondary"
                icon={<UploadOutlined />}
                onClick={handleImport}
              >
                Import Excel
              </Button>
              <Button
                className="btn-secondary"
                type="default"
                icon={<FileExcelOutlined />}
                onClick={handleExport}
              >
                Export Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          className="modern-table"
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredEmployees.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nhân viên`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <EmployeeModal
        visible={modalVisible}
        employee={editingEmployee}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <ExcelImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />

      <ExcelExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        employees={employees}
      />
    </div>
  );
};

export default EmployeeTable;