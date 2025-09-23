import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, UserAddOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login, register, LoginData, RegisterData } from '../services/authService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const onLoginFinish = async (values: LoginData) => {
    console.log('Login form submitted:', values);
    setLoading(true);
    
    try {
      const response = await login(values);
      console.log('Login response:', response);
      
      if (response.success) {
        message.success(response.message);
        navigate('/dashboard');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  const onRegisterFinish = async (values: RegisterData & { confirmPassword: string }) => {
    console.log('Register form submitted:', values);
    
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = values;
      const response = await register(registerData);
      console.log('Register response:', response);
      
      if (response.success) {
        message.success(response.message);
        
        // Clear form đăng ký
        registerForm.resetFields();
        
        // Chuyển sang tab đăng nhập
        setActiveTab('login');
        
        // Đợi một chút để tab chuyển xong, rồi điền email vào form đăng nhập
        setTimeout(() => {
          loginForm.setFieldsValue({
            email: values.email
          });
        }, 100);
        
        message.info('Vui lòng đăng nhập với tài khoản vừa tạo');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      message.error('Có lỗi xảy ra khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: 450,
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            VTNET Career
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Hệ thống Quản lý Sự nghiệp
          </Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          style={{ marginBottom: 24 }}
        >
          <TabPane 
            tab={
              <span>
                <LoginOutlined />
                Đăng nhập
              </span>
            } 
            key="login"
          >
            <Form
              form={loginForm}
              name="login"
              onFinish={onLoginFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Email"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Mật khẩu"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <UserAddOutlined />
                Đăng ký
              </span>
            } 
            key="register"
          >
            <Form
              form={registerForm}
              name="register"
              onFinish={onRegisterFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Họ và tên"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Email"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Số điện thoại (tùy chọn)"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Mật khẩu"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Xác nhận mật khẩu"
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<UserAddOutlined />}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {activeTab === 'login' 
              ? 'Chưa có tài khoản? Chuyển sang tab Đăng ký' 
              : 'Đã có tài khoản? Chuyển sang tab Đăng nhập'
            }
          </Text>
        </div>

      </Card>
    </div>
  );
};

export default Auth;