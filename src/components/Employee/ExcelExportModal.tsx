import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Checkbox, 
  Button, 
  Space, 
  Typography, 
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  message,
  Divider
} from 'antd';
import { 
  DownloadOutlined, 
  FileExcelOutlined,
  FilterOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { Employee } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ExcelExportModalProps {
  visible: boolean;
  onClose: () => void;
  employees: Employee[];
}

interface ExportField {
  key: string;
  label: string;
  category: string;
}

const ExcelExportModal: React.FC<ExcelExportModalProps> = ({ visible, onClose, employees }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const exportFields: ExportField[] = [
    // Thông tin cơ bản
    { key: 'employeeCode', label: 'Mã nhân viên', category: 'basic' },
    { key: 'fullName', label: 'Họ và tên', category: 'basic' },
    { key: 'email', label: 'Email', category: 'basic' },
    { key: 'phone', label: 'Số điện thoại', category: 'basic' },
    { key: 'joinDate', label: 'Ngày vào làm', category: 'basic' },
    { key: 'status', label: 'Trạng thái', category: 'basic' },
    
    // Thông tin công việc
    { key: 'department', label: 'Phòng ban', category: 'work' },
    { key: 'position', label: 'Chức vụ', category: 'work' },
    { key: 'level', label: 'Bậc lương', category: 'work' },
    { key: 'manager', label: 'Quản lý trực tiếp', category: 'work' },
    
    // Kỹ năng và chứng chỉ
    { key: 'skills', label: 'Kỹ năng', category: 'skills' },
    { key: 'certifications', label: 'Chứng chỉ', category: 'skills' },
    
    // Lộ trình sự nghiệp
    { key: 'currentLevel', label: 'Bậc hiện tại (Lộ trình)', category: 'career' },
    { key: 'targetLevel', label: 'Bậc mục tiêu (Lộ trình)', category: 'career' },
    { key: 'careerProgress', label: 'Tiến độ sự nghiệp (%)', category: 'career' },
    { key: 'profession', label: 'Chuyên môn', category: 'career' },
  ];

  const fieldCategories = [
    { key: 'basic', label: 'Thông tin cơ bản', color: '#1890ff' },
    { key: 'work', label: 'Thông tin công việc', color: '#52c41a' },
    { key: 'skills', label: 'Kỹ năng & Chứng chỉ', color: '#faad14' },
    { key: 'career', label: 'Lộ trình sự nghiệp', color: '#722ed1' },
  ];

  const handleExport = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Filter employees based on criteria
      let filteredEmployees = [...employees];

      if (values.departments && values.departments.length > 0) {
        filteredEmployees = filteredEmployees.filter(emp => 
          values.departments.includes(emp.department)
        );
      }

      if (values.status && values.status.length > 0) {
        filteredEmployees = filteredEmployees.filter(emp => 
          values.status.includes(emp.status)
        );
      }

      if (values.dateRange && values.dateRange.length === 2) {
        const [startDate, endDate] = values.dateRange;
        filteredEmployees = filteredEmployees.filter(emp => {
          const joinDate = dayjs(emp.joinDate);
          return joinDate.isAfter(startDate) && joinDate.isBefore(endDate);
        });
      }

      // Prepare export data
      const selectedFields = values.fields || [];
      const exportData = filteredEmployees.map(emp => {
        const row: any = {};
        
        selectedFields.forEach((fieldKey: string) => {
          const field = exportFields.find(f => f.key === fieldKey);
          if (!field) return;

          switch (fieldKey) {
            case 'skills':
              row[field.label] = emp.skills.join('; ');
              break;
            case 'certifications':
              row[field.label] = emp.certifications.map(cert => 
                `${cert.name} (${cert.issuer})`
              ).join('; ');
              break;
            case 'currentLevel':
              row[field.label] = emp.careerPath.currentLevel;
              break;
            case 'targetLevel':
              row[field.label] = emp.careerPath.targetLevel;
              break;
            case 'careerProgress':
              row[field.label] = emp.careerPath.progressPercentage;
              break;
            case 'profession':
              row[field.label] = emp.careerPath.profession;
              break;
            case 'status':
              row[field.label] = emp.status === 'active' ? 'Đang làm việc' :
                               emp.status === 'inactive' ? 'Nghỉ việc' : 'Nghỉ phép';
              break;
            default:
              row[field.label] = emp[fieldKey as keyof Employee] || '';
          }
        });

        return row;
      });

      if (exportData.length === 0) {
        message.warning('Không có dữ liệu để xuất');
        return;
      }

      // Create Excel workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách nhân viên');

      // Set column widths
      const colWidths = selectedFields.map((fieldKey: string) => {
        const field = exportFields.find(f => f.key === fieldKey);
        return { wch: Math.max(field?.label.length || 10, 15) };
      });
      ws['!cols'] = colWidths;

      // Generate filename with timestamp
      const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
      const filename = `danh_sach_nhan_vien_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);
      message.success(`Đã xuất ${exportData.length} nhân viên ra file ${filename}`);
      onClose();

    } catch (error) {
      console.error('Export error:', error);
      message.error('Có lỗi xảy ra khi xuất dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const statusOptions = [
    { value: 'active', label: 'Đang làm việc' },
    { value: 'inactive', label: 'Nghỉ việc' },
    { value: 'on_leave', label: 'Nghỉ phép' },
  ];

  return (
    <Modal
      title={
        <Space>
          <FileExcelOutlined />
          Xuất danh sách nhân viên ra Excel
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="export" 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleExport}
          loading={loading}
        >
          Xuất Excel
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fields: ['employeeCode', 'fullName', 'email', 'department', 'position', 'level', 'status']
        }}
      >
        {/* Filter Section */}
        <Card 
          title={
            <Space>
              <FilterOutlined />
              Bộ lọc dữ liệu
            </Space>
          }
          size="small" 
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="departments" label="Phòng ban">
                <Select
                  mode="multiple"
                  placeholder="Tất cả phòng ban"
                  allowClear
                >
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  mode="multiple"
                  placeholder="Tất cả trạng thái"
                  allowClear
                >
                  {statusOptions.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateRange" label="Ngày vào làm">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Fields Selection */}
        <Card title="Chọn thông tin cần xuất" size="small">
          <Form.Item name="fields">
            <Checkbox.Group style={{ width: '100%' }}>
              {fieldCategories.map(category => (
                <div key={category.key} style={{ marginBottom: 16 }}>
                  <Title 
                    level={5} 
                    style={{ 
                      color: category.color, 
                      marginBottom: 8,
                      borderLeft: `4px solid ${category.color}`,
                      paddingLeft: 8
                    }}
                  >
                    {category.label}
                  </Title>
                  <Row gutter={[16, 8]}>
                    {exportFields
                      .filter(field => field.category === category.key)
                      .map(field => (
                        <Col span={12} key={field.key}>
                          <Checkbox value={field.key}>
                            {field.label}
                          </Checkbox>
                        </Col>
                      ))}
                  </Row>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Divider />

          <Space>
            <Button 
              size="small"
              onClick={() => {
                const allFields = exportFields.map(f => f.key);
                form.setFieldsValue({ fields: allFields });
              }}
            >
              Chọn tất cả
            </Button>
            <Button 
              size="small"
              onClick={() => {
                form.setFieldsValue({ fields: [] });
              }}
            >
              Bỏ chọn tất cả
            </Button>
            <Button 
              size="small"
              onClick={() => {
                const basicFields = exportFields
                  .filter(f => f.category === 'basic')
                  .map(f => f.key);
                form.setFieldsValue({ fields: basicFields });
              }}
            >
              Chỉ thông tin cơ bản
            </Button>
          </Space>
        </Card>

        <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 6 }}>
          <Text type="secondary">
            <strong>Tổng số nhân viên:</strong> {employees.length} | 
            <strong> Định dạng:</strong> Excel (.xlsx) | 
            <strong> Mã hóa:</strong> UTF-8
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default ExcelExportModal;