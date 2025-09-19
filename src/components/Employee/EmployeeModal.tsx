import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message, Row, Col, DatePicker } from 'antd';
import { Employee } from '../../types';
import { employeeAPI } from '../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface EmployeeModalProps {
  visible: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ visible, employee, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const isEditing = !!employee;

  useEffect(() => {
    if (visible && employee) {
      form.setFieldsValue({
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        level: employee.level,
        joinDate: dayjs(employee.joinDate),
        status: employee.status,
        manager: employee.manager,
        skills: employee.skills.join(', '),
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, employee, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const employeeData = {
        employeeCode: values.employeeCode,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        department: values.department,
        position: values.position,
        level: values.level,
        joinDate: values.joinDate.format('YYYY-MM-DD'),
        status: values.status,
        manager: values.manager,
        skills: values.skills ? values.skills.split(',').map((s: string) => s.trim()) : [],
        certifications: employee?.certifications || [],
      };

      if (isEditing) {
        await employeeAPI.updateEmployee(employee!.id, employeeData);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await employeeAPI.createEmployee(employeeData);
        message.success('Thêm nhân viên thành công');
      }

      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(isEditing ? 'Không thể cập nhật nhân viên' : 'Không thể thêm nhân viên');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditing ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
          level: 'Bậc 11',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="employeeCode"
              label="Mã nhân viên"
              rules={[
                { required: true, message: 'Vui lòng nhập mã nhân viên!' },
                { pattern: /^VT\d{3,}$/, message: 'Mã nhân viên phải có định dạng VTxxx!' },
              ]}
            >
              <Input placeholder="VT001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
              ]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="example@vtnet.vn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
              ]}
            >
              <Input placeholder="0901234567" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Phòng ban"
              rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
            >
              <Select placeholder="Chọn phòng ban">
                <Option value="Công nghệ thông tin">Công nghệ thông tin</Option>
                <Option value="Quản lý tác động">Quản lý tác động</Option>
                <Option value="Nhân sự">Nhân sự</Option>
                <Option value="Kế toán">Kế toán</Option>
                <Option value="Marketing">Marketing</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Chức vụ"
              rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
            >
              <Input placeholder="Kỹ sư phần mềm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="level"
              label="Bậc lương"
              rules={[{ required: true, message: 'Vui lòng chọn bậc lương!' }]}
            >
              <Select placeholder="Chọn bậc lương">
                <Option value="Bậc 11">Bậc 11</Option>
                <Option value="Bậc 12">Bậc 12</Option>
                <Option value="Bậc 13">Bậc 13</Option>
                <Option value="Bậc 14">Bậc 14</Option>
                <Option value="Bậc 15">Bậc 15</Option>
                <Option value="Bậc 16">Bậc 16</Option>
                <Option value="Bậc 17">Bậc 17</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="joinDate"
              label="Ngày vào làm"
              rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm!' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Đang làm việc</Option>
                <Option value="on_leave">Nghỉ phép</Option>
                <Option value="inactive">Nghỉ việc</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="manager"
              label="Quản lý trực tiếp"
            >
              <Input placeholder="Tên quản lý trực tiếp" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="skills"
          label="Kỹ năng (phân cách bằng dấu phẩy)"
        >
          <TextArea 
            rows={3} 
            placeholder="React, Node.js, TypeScript, AWS" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;