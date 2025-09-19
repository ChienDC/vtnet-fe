import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Department } from '../../types';
import { departmentAPI } from '../../services/api';

const { TextArea } = Input;

interface DepartmentModalProps {
  visible: boolean;
  department: Department | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ visible, department, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const isEditing = !!department;

  useEffect(() => {
    if (visible && department) {
      form.setFieldsValue({
        code: department.code,
        name: department.name,
        description: department.description,
        manager: department.manager,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, department, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const departmentData = {
        code: values.code,
        name: values.name,
        description: values.description,
        manager: values.manager,
        employeeCount: department?.employeeCount || 0,
      };

      if (isEditing) {
        // await departmentAPI.updateDepartment(department!.id, departmentData);
        message.success('Cập nhật phòng ban thành công');
      } else {
        await departmentAPI.createDepartment(departmentData);
        message.success('Thêm phòng ban thành công');
      }

      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(isEditing ? 'Không thể cập nhật phòng ban' : 'Không thể thêm phòng ban');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isEditing ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="code"
          label="Mã phòng ban"
          rules={[
            { required: true, message: 'Vui lòng nhập mã phòng ban!' },
            { pattern: /^[A-Z]{2,5}$/, message: 'Mã phòng ban phải là 2-5 ký tự viết hoa!' },
          ]}
        >
          <Input placeholder="IT, HR, ACC..." />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên phòng ban"
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng ban!' },
            { min: 3, message: 'Tên phòng ban phải có ít nhất 3 ký tự!' },
          ]}
        >
          <Input placeholder="Công nghệ thông tin" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả!' },
          ]}
        >
          <TextArea 
            rows={3} 
            placeholder="Mô tả về chức năng và nhiệm vụ của phòng ban" 
          />
        </Form.Item>

        <Form.Item
          name="manager"
          label="Trưởng phòng"
          rules={[
            { required: true, message: 'Vui lòng nhập tên trưởng phòng!' },
          ]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentModal;