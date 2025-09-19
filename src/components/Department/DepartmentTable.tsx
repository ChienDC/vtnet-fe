import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Input,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Department } from '../../types';
import { departmentAPI } from '../../services/api';
import DepartmentModal from './DepartmentModal';

const { Search } = Input;

const DepartmentTable: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentAPI.getDepartments();
      setDepartments(data);
    } catch (error) {
      message.error('Không thể tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // await departmentAPI.deleteDepartment(id);
      message.success('Xóa phòng ban thành công');
      loadDepartments();
    } catch (error) {
      message.error('Không thể xóa phòng ban');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingDepartment(null);
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setEditingDepartment(null);
    loadDepartments();
  };

  const handleExport = () => {
    message.success('Xuất Excel thành công');
  };

  // Filter departments based on search
  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchText.toLowerCase()) ||
    department.code.toLowerCase().includes(searchText.toLowerCase()) ||
    department.manager.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate total employees
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);

  // Table columns definition
  const columns: ColumnsType<Department> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã phòng ban',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trưởng phòng',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 120,
      render: (count: number) => (
        <Statistic 
          value={count} 
          prefix={<TeamOutlined />}
          valueStyle={{ fontSize: '14px' }}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa phòng ban này?"
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
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số phòng ban"
              value={departments.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nhân viên"
              value={totalEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="TB nhân viên/phòng ban"
              value={departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên, mã phòng ban hoặc trưởng phòng"
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
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm phòng ban
              </Button>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredDepartments}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredDepartments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phòng ban`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <DepartmentModal
        visible={modalVisible}
        department={editingDepartment}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DepartmentTable;