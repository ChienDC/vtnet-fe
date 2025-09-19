import React, { useState } from 'react';
import { 
  Modal, 
  Upload, 
  Button, 
  Table, 
  message, 
  Steps, 
  Alert, 
  Progress,
  Typography,
  Space,
  Tag,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import { Employee } from '../../types';

const { Step } = Steps;
const { Title, Text } = Typography;

interface ExcelImportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (employees: Employee[]) => void;
}

interface ImportData {
  [key: string]: any;
}

interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ visible, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validEmployees, setValidEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Template Excel structure
  const excelTemplate = [
    { field: 'employeeCode', label: 'Mã nhân viên', required: true, example: 'VT001' },
    { field: 'fullName', label: 'Họ và tên', required: true, example: 'Nguyễn Văn A' },
    { field: 'email', label: 'Email', required: true, example: 'a.nguyen@vtnet.vn' },
    { field: 'phone', label: 'Số điện thoại', required: true, example: '0901234567' },
    { field: 'department', label: 'Phòng ban', required: true, example: 'Công nghệ thông tin' },
    { field: 'position', label: 'Chức vụ', required: true, example: 'Kỹ sư phần mềm' },
    { field: 'level', label: 'Bậc lương', required: true, example: 'Bậc 12' },
    { field: 'joinDate', label: 'Ngày vào làm', required: true, example: '2024-01-15' },
    { field: 'status', label: 'Trạng thái', required: true, example: 'active' },
    { field: 'manager', label: 'Quản lý trực tiếp', required: false, example: 'Trần Văn B' },
    { field: 'skills', label: 'Kỹ năng (phân cách bằng ;)', required: false, example: 'React;Node.js;TypeScript' },
  ];

  const downloadTemplate = () => {
    const templateData = [
      // Header row
      excelTemplate.reduce((acc, col) => {
        acc[col.label + (col.required ? ' *' : '')] = col.example;
        return acc;
      }, {} as any)
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Set column widths
    const colWidths = excelTemplate.map(col => ({ wch: Math.max(col.label.length, col.example.length) + 5 }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'template_nhan_vien.xlsx');
    message.success('Đã tải xuống template Excel');
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Chỉ chấp nhận file Excel (.xlsx, .xls)');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      if (newFileList.length > 0) {
        processExcelFile(newFileList[0].originFileObj!);
      }
    },
  };

  const processExcelFile = async (file: File) => {
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        message.error('File Excel không có dữ liệu');
        return;
      }

      setImportData(jsonData as ImportData[]);
      setCurrentStep(1);
      validateData(jsonData as ImportData[]);
    } catch (error) {
      message.error('Không thể đọc file Excel');
      console.error('Excel processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateData = (data: ImportData[]) => {
    const errors: ValidationError[] = [];
    const validData: Employee[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // Excel row number (starting from 2, accounting for header)
      
      // Validate required fields
      excelTemplate.forEach(template => {
        const fieldKey = Object.keys(row).find(key => 
          key.toLowerCase().includes(template.label.toLowerCase().replace(' *', ''))
        );
        
        if (!fieldKey) {
          if (template.required) {
            errors.push({
              row: rowNumber,
              field: template.label,
              value: '',
              message: 'Thiếu cột bắt buộc'
            });
          }
          return;
        }

        const value = row[fieldKey];
        
        if (template.required && (!value || value.toString().trim() === '')) {
          errors.push({
            row: rowNumber,
            field: template.label,
            value: value,
            message: 'Không được để trống'
          });
        }

        // Specific validations
        if (template.field === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              row: rowNumber,
              field: template.label,
              value: value,
              message: 'Email không hợp lệ'
            });
          }
        }

        if (template.field === 'phone' && value) {
          const phoneRegex = /^[0-9]{10,11}$/;
          if (!phoneRegex.test(value.toString().replace(/\s/g, ''))) {
            errors.push({
              row: rowNumber,
              field: template.label,
              value: value,
              message: 'Số điện thoại không hợp lệ'
            });
          }
        }

        if (template.field === 'employeeCode' && value) {
          const codeRegex = /^VT\d{3,}$/;
          if (!codeRegex.test(value)) {
            errors.push({
              row: rowNumber,
              field: template.label,
              value: value,
              message: 'Mã nhân viên phải có định dạng VTxxx'
            });
          }
        }

        if (template.field === 'status' && value) {
          const validStatuses = ['active', 'inactive', 'on_leave'];
          if (!validStatuses.includes(value)) {
            errors.push({
              row: rowNumber,
              field: template.label,
              value: value,
              message: 'Trạng thái phải là: active, inactive, hoặc on_leave'
            });
          }
        }
      });

      // If no errors for this row, create employee object
      const rowErrors = errors.filter(e => e.row === rowNumber);
      if (rowErrors.length === 0) {
        const employee: Employee = {
          id: `import_${Date.now()}_${index}`,
          employeeCode: getFieldValue(row, 'Mã nhân viên'),
          fullName: getFieldValue(row, 'Họ và tên'),
          email: getFieldValue(row, 'Email'),
          phone: getFieldValue(row, 'Số điện thoại'),
          department: getFieldValue(row, 'Phòng ban'),
          position: getFieldValue(row, 'Chức vụ'),
          level: getFieldValue(row, 'Bậc lương'),
          joinDate: getFieldValue(row, 'Ngày vào làm'),
          status: getFieldValue(row, 'Trạng thái') as 'active' | 'inactive' | 'on_leave',
          manager: getFieldValue(row, 'Quản lý trực tiếp') || undefined,
          skills: getFieldValue(row, 'Kỹ năng')?.split(';').map((s: string) => s.trim()).filter(Boolean) || [],
          certifications: [],
          careerPath: {
            id: `career_${Date.now()}_${index}`,
            employeeId: `import_${Date.now()}_${index}`,
            currentLevel: getFieldValue(row, 'Bậc lương'),
            targetLevel: getFieldValue(row, 'Bậc lương'),
            department: getFieldValue(row, 'Phòng ban'),
            profession: '',
            progressPercentage: 0,
            milestones: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        validData.push(employee);
      }
    });

    setValidationErrors(errors);
    setValidEmployees(validData);
    setCurrentStep(2);
  };

  const getFieldValue = (row: ImportData, fieldLabel: string): any => {
    const fieldKey = Object.keys(row).find(key => 
      key.toLowerCase().includes(fieldLabel.toLowerCase().replace(' *', ''))
    );
    return fieldKey ? row[fieldKey] : '';
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      message.error('Vui lòng sửa các lỗi trước khi import');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess(validEmployees);
      message.success(`Đã import thành công ${validEmployees.length} nhân viên`);
      handleClose();
    } catch (error) {
      message.error('Có lỗi xảy ra khi import dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setFileList([]);
    setImportData([]);
    setValidationErrors([]);
    setValidEmployees([]);
    onClose();
  };

  const errorColumns = [
    {
      title: 'Dòng',
      dataIndex: 'row',
      key: 'row',
      width: 80,
    },
    {
      title: 'Trường',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: any) => (
        <Text code>{value || '(trống)'}</Text>
      ),
    },
    {
      title: 'Lỗi',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => (
        <Text type="danger">{message}</Text>
      ),
    },
  ];

  const previewColumns = [
    {
      title: 'Mã NV',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
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
      render: (level: string) => <Tag color="blue">{level}</Tag>,
    },
  ];

  return (
    <Modal
      title="Import danh sách nhân viên từ Excel"
      open={visible}
      onCancel={handleClose}
      width={1000}
      footer={null}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Tải file" icon={<UploadOutlined />} />
        <Step title="Xử lý dữ liệu" icon={<FileExcelOutlined />} />
        <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
      </Steps>

      {currentStep === 0 && (
        <div>
          <Alert
            message="Hướng dẫn import Excel"
            description={
              <div>
                <p>1. Tải xuống template Excel mẫu</p>
                <p>2. Điền thông tin nhân viên vào template</p>
                <p>3. Tải lên file Excel đã hoàn thành</p>
                <p><strong>Lưu ý:</strong> Các trường có dấu (*) là bắt buộc</p>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
              size="large"
            >
              Tải xuống Template Excel
            </Button>

            <Divider>Hoặc</Divider>

            <Upload.Dragger {...uploadProps} style={{ padding: 20 }}>
              <p className="ant-upload-drag-icon">
                <FileExcelOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file Excel vào đây</p>
              <p className="ant-upload-hint">
                Hỗ trợ file .xlsx và .xls
              </p>
            </Upload.Dragger>
          </Space>
        </div>
      )}

      {currentStep === 1 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Progress type="circle" percent={loading ? 50 : 100} />
          <Title level={4} style={{ marginTop: 16 }}>
            {loading ? 'Đang xử lý dữ liệu...' : 'Xử lý hoàn tất'}
          </Title>
          <Text type="secondary">
            Đang kiểm tra và xác thực dữ liệu từ file Excel
          </Text>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <Space direction="vertical" style={{ width: '100%' }}>
            {validationErrors.length > 0 ? (
              <Alert
                message={`Phát hiện ${validationErrors.length} lỗi`}
                description="Vui lòng sửa các lỗi sau trước khi tiếp tục"
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            ) : (
              <Alert
                message={`Dữ liệu hợp lệ - ${validEmployees.length} nhân viên`}
                description="Tất cả dữ liệu đã được xác thực thành công"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}

            {validationErrors.length > 0 && (
              <div>
                <Title level={5}>Chi tiết lỗi:</Title>
                <Table
                  columns={errorColumns}
                  dataSource={validationErrors}
                  rowKey={(record, index) => `${record.row}-${record.field}-${index}`}
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </div>
            )}

            {validEmployees.length > 0 && (
              <div>
                <Title level={5}>Xem trước dữ liệu ({validEmployees.length} nhân viên):</Title>
                <Table
                  columns={previewColumns}
                  dataSource={validEmployees}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={handleClose}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleImport}
                  disabled={validationErrors.length > 0}
                  loading={loading}
                >
                  Import {validEmployees.length} nhân viên
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      )}
    </Modal>
  );
};

export default ExcelImportModal;