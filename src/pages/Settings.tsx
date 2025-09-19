import React from 'react';
import { Card, Form, Input, Select, Switch, Button, Typography, Divider } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
  };

  return (
    <div>
      <Title level={2}>Cài đặt</Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            theme: 'light',
            language: 'vi',
            notifications: true,
            autoSave: true,
          }}
        >
          <Title level={4}>Giao diện</Title>
          <Form.Item
            name="theme"
            label="Theme"
          >
            <Select>
              <Option value="light">Sáng</Option>
              <Option value="dark">Tối</Option>
              <Option value="auto">Tự động</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="language"
            label="Ngôn ngữ"
          >
            <Select>
              <Option value="vi">Tiếng Việt</Option>
              <Option value="en">English</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Title level={4}>Hệ thống</Title>
          <Form.Item
            name="notifications"
            label="Thông báo"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="autoSave"
            label="Tự động lưu"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="maxUploadSize"
            label="Kích thước upload tối đa (MB)"
          >
            <Input type="number" placeholder="10" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;