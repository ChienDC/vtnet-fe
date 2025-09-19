import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  Switch,
  message,
  Typography,
  Tag,
  Popconfirm,
  Upload,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType, UploadProps } from 'antd';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface EvaluationCriteria {
  id: string;
  name: string;
  category: string;
  weight: number;
  description: string;
  type: 'numeric' | 'text' | 'boolean' | 'scale';
  minValue?: number;
  maxValue?: number;
  options?: string[];
  required: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const CriteriaManagement: React.FC = () => {
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<EvaluationCriteria | null>(null);
  const [form] = Form.useForm();

  // Mock data
  const mockCriteria: EvaluationCriteria[] = [
    {
      id: '1',
      name: 'Kỹ năng lập trình',
      category: 'Kỹ năng chuyên môn',
      weight: 30,
      description: 'Đánh giá khả năng lập trình và giải quyết vấn đề',
      type: 'scale',
      minValue: 1,
      maxValue: 5,
      required: true,
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Giao tiếp và làm việc nhóm',
      category: 'Kỹ năng mềm',
      weight: 20,
      description: 'Khả năng giao tiếp và phối hợp trong nhóm',
      type: 'scale',
      minValue: 1,
      maxValue: 5,
      required: true,
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Số năm kinh nghiệm',
      category: 'Kinh nghiệm',
      weight: 25,
      description: 'Tổng số năm kinh nghiệm làm việc',
      type: 'numeric',
      minValue: 0,
      maxValue: 50,
      required: true,
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'Chứng chỉ chuyên môn',
      category: 'Chứng chỉ',
      weight: 15,
      description: 'Có chứng chỉ chuyên môn liên quan',
      type: 'boolean',
      required: false,
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'Khả năng lãnh đạo',
      category: 'Kỹ năng quản lý',
      weight: 10,
      description: 'Đánh giá khả năng lãnh đạo và quản lý',
      type: 'scale',
      minValue: 1,
      maxValue: 5,
      required: false,
      active: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  useEffect(() => {
    loadCriteria();
  }, []);

  const loadCriteria = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCriteria(mockCriteria);
    } catch (error) {
      message.error('Không thể tải danh sách tiêu chí');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCriteria(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (criteria: EvaluationCriteria) => {
    setEditingCriteria(criteria);
    form.setFieldsValue(criteria);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setCriteria(prev => prev.filter(c => c.id !== id));
      message.success('Xóa tiêu chí thành công');
    } catch (error) {
      message.error('Không thể xóa tiêu chí');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCriteria) {
        // Update existing criteria
        setCriteria(prev => prev.map(c => 
          c.id === editingCriteria.id 
            ? { ...c, ...values, updatedAt: new Date().toISOString() }
            : c
        ));
        message.success('Cập nhật tiêu chí thành công');
      } else {
        // Add new criteria
        const newCriteria: EvaluationCriteria = {
          ...values,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCriteria(prev => [...prev, newCriteria]);
        message.success('Thêm tiêu chí thành công');
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleExport = () => {
    const exportData = criteria.map(c => ({
      'Tên tiêu chí': c.name,
      'Danh mục': c.category,
      'Trọng số (%)': c.weight,
      'Mô tả': c.description,
      'Loại dữ liệu': c.type === 'numeric' ? 'Số' : 
                     c.type === 'text' ? 'Văn bản' :
                     c.type === 'boolean' ? 'Có/Không' : 'Thang điểm',
      'Giá trị tối thiểu': c.minValue || '',
      'Giá trị tối đa': c.maxValue || '',
      'Bắt buộc': c.required ? 'Có' : 'Không',
      'Trạng thái': c.active ? 'Hoạt động' : 'Không hoạt động'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tiêu chí đánh giá');

    XLSX.writeFile(wb, 'tieu_chi_danh_gia.xlsx');
    message.success('Đã xuất danh sách tiêu chí ra Excel');
  };

  const handleImport = () => {
    setImportModalVisible(true);
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    maxCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Process imported data
          const importedCriteria = jsonData.map((row: any, index: number) => ({
            id: `import_${Date.now()}_${index}`,
            name: row['Tên tiêu chí'] || '',
            category: row['Danh mục'] || '',
            weight: parseInt(row['Trọng số (%)']) || 0,
            description: row['Mô tả'] || '',
            type: row['Loại dữ liệu'] === 'Số' ? 'numeric' :
                  row['Loại dữ liệu'] === 'Văn bản' ? 'text' :
                  row['Loại dữ liệu'] === 'Có/Không' ? 'boolean' : 'scale',
            minValue: row['Giá trị tối thiểu'] ? parseInt(row['Giá trị tối thiểu']) : undefined,
            maxValue: row['Giá trị tối đa'] ? parseInt(row['Giá trị tối đa']) : undefined,
            required: row['Bắt buộc'] === 'Có',
            active: row['Trạng thái'] === 'Hoạt động',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })) as EvaluationCriteria[];

          setCriteria(prev => [...prev, ...importedCriteria]);
          message.success(`Đã import thành công ${importedCriteria.length} tiêu chí`);
          setImportModalVisible(false);
        } catch (error) {
          message.error('Không thể đọc file Excel');
        }
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
  };

  const columns: ColumnsType<EvaluationCriteria> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên tiêu chí',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <Text strong>{name}</Text>
          {!record.active && <Tag color="red" style={{ marginLeft: 8 }}>Không hoạt động</Tag>}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Trọng số',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight: number) => `${weight}%`,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          'numeric': { text: 'Số', color: 'green' },
          'text': { text: 'Văn bản', color: 'blue' },
          'boolean': { text: 'Có/Không', color: 'orange' },
          'scale': { text: 'Thang điểm', color: 'purple' }
        };
        const typeInfo = typeMap[type as keyof typeof typeMap];
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: 'Phạm vi',
      key: 'range',
      render: (_, record) => {
        if (record.type === 'numeric' || record.type === 'scale') {
          return `${record.minValue || 0} - ${record.maxValue || 0}`;
        }
        return '-';
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>
          {required ? 'Có' : 'Không'}
        </Tag>
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
          />
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa tiêu chí này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const categories = Array.from(new Set(criteria.map(c => c.category)));

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <SettingOutlined style={{ marginRight: 8 }} />
            Quản lý Tiêu chí Đánh giá
          </Title>
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              Thêm tiêu chí
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>
              Import Excel
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export Excel
            </Button>
          </Space>
        </div>

        <Alert
          message="Thông tin về tiêu chí đánh giá"
          description="Các tiêu chí này sẽ được sử dụng để đánh giá nhân viên trong quá trình phát triển sự nghiệp. Tổng trọng số của tất cả tiêu chí hoạt động nên bằng 100%."
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={criteria}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tiêu chí`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCriteria ? 'Chỉnh sửa tiêu chí' : 'Thêm tiêu chí mới'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên tiêu chí"
            rules={[{ required: true, message: 'Vui lòng nhập tên tiêu chí' }]}
          >
            <Input placeholder="Ví dụ: Kỹ năng lập trình" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn hoặc nhập danh mục mới" allowClear showSearch>
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="weight"
            label="Trọng số (%)"
            rules={[
              { required: true, message: 'Vui lòng nhập trọng số' },
              { type: 'number', min: 0, max: 100, message: 'Trọng số phải từ 0-100%' }
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn loại dữ liệu' }]}
          >
            <Select placeholder="Chọn loại dữ liệu">
              <Option value="numeric">Số</Option>
              <Option value="text">Văn bản</Option>
              <Option value="boolean">Có/Không</Option>
              <Option value="scale">Thang điểm</Option>
            </Select>
          </Form.Item>

          <Form.Item dependencies={['type']}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'numeric' || type === 'scale') {
                return (
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item
                      name="minValue"
                      label="Giá trị tối thiểu"
                      style={{ flex: 1 }}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="maxValue"
                      label="Giá trị tối đa"
                      style={{ flex: 1 }}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết về tiêu chí này" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 24 }}>
            <Form.Item name="required" valuePropName="checked">
              <Switch /> <span style={{ marginLeft: 8 }}>Bắt buộc</span>
            </Form.Item>
            <Form.Item name="active" valuePropName="checked" initialValue={true}>
              <Switch /> <span style={{ marginLeft: 8 }}>Hoạt động</span>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import tiêu chí từ Excel"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Alert
          message="Hướng dẫn import"
          description="File Excel cần có các cột: Tên tiêu chí, Danh mục, Trọng số (%), Mô tả, Loại dữ liệu, Giá trị tối thiểu, Giá trị tối đa, Bắt buộc, Trạng thái"
          type="info"
          style={{ marginBottom: 16 }}
        />
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click hoặc kéo file Excel vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ file .xlsx và .xls</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default CriteriaManagement;