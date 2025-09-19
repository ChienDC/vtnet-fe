import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Typography, 
  Tag, 
  Progress, 
  Timeline, 
  Button, 
  Descriptions,
  Tabs,
  List,
  Space,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { Employee } from '../types';
import { employeeAPI } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EmployeeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEmployee(id);
    }
  }, [id]);

  const loadEmployee = async (employeeId: string) => {
    try {
      const data = await employeeAPI.getEmployee(employeeId);
      setEmployee(data);
    } catch (error) {
      console.error('Error loading employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin nhân viên...</div>;
  }

  if (!employee) {
    return <div>Không tìm thấy thông tin nhân viên</div>;
  }

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

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/employees')}
          style={{ marginRight: 16 }}
        >
          Quay lại
        </Button>
        <Button type="primary" icon={<EditOutlined />}>
          Chỉnh sửa
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={employee.avatar}
                style={{ marginBottom: 16 }}
              />
              <Title level={3}>{employee.fullName}</Title>
              <Text type="secondary">{employee.employeeCode}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={getStatusColor(employee.status)}>
                  {getStatusText(employee.status)}
                </Tag>
              </div>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <MailOutlined style={{ marginRight: 8 }} />
                <Text>{employee.email}</Text>
              </div>
              <div>
                <PhoneOutlined style={{ marginRight: 8 }} />
                <Text>{employee.phone}</Text>
              </div>
              <div>
                <TeamOutlined style={{ marginRight: 8 }} />
                <Text>{employee.department}</Text>
              </div>
              <div>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <Text>Ngày vào làm: {employee.joinDate}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={16}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Thông tin cơ bản" key="1">
              <Card>
                <Descriptions title="Chi tiết nhân viên" bordered column={2}>
                  <Descriptions.Item label="Mã nhân viên">{employee.employeeCode}</Descriptions.Item>
                  <Descriptions.Item label="Họ và tên">{employee.fullName}</Descriptions.Item>
                  <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{employee.phone}</Descriptions.Item>
                  <Descriptions.Item label="Phòng ban">{employee.department}</Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">{employee.position}</Descriptions.Item>
                  <Descriptions.Item label="Bậc lương">{employee.level}</Descriptions.Item>
                  <Descriptions.Item label="Quản lý trực tiếp">{employee.manager || 'Chưa có'}</Descriptions.Item>
                  <Descriptions.Item label="Ngày vào làm" span={2}>{employee.joinDate}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4}>Kỹ năng</Title>
                <div style={{ marginBottom: 16 }}>
                  {employee.skills.map((skill, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </Card>
            </TabPane>

            <TabPane tab="Lộ trình sự nghiệp" key="2">
              <Card>
                <div style={{ marginBottom: 24 }}>
                  <Title level={4}>
                    <RiseOutlined style={{ marginRight: 8 }} />
                    Tiến độ sự nghiệp
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Bậc hiện tại: </Text>
                      <Tag color="blue">{employee.careerPath.currentLevel}</Tag>
                    </Col>
                    <Col span={12}>
                      <Text strong>Bậc mục tiêu: </Text>
                      <Tag color="green">{employee.careerPath.targetLevel}</Tag>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 16 }}>
                    <Text strong>Tiến độ tổng thể: </Text>
                    <Progress 
                      percent={employee.careerPath.progressPercentage} 
                      status="active"
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </div>
                </div>

                <Title level={4}>Các mục tiêu</Title>
                <Timeline>
                  {employee.careerPath.milestones.map((milestone) => (
                    <Timeline.Item
                      key={milestone.id}
                      color={getMilestoneColor(milestone.status)}
                    >
                      <div>
                        <Text strong>{milestone.title}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text type="secondary">{milestone.description}</Text>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Tag color={getMilestoneColor(milestone.status)}>
                            {milestone.status === 'completed' ? 'Hoàn thành' :
                             milestone.status === 'in_progress' ? 'Đang thực hiện' :
                             milestone.status === 'overdue' ? 'Quá hạn' : 'Chờ thực hiện'}
                          </Tag>
                          <Text type="secondary">
                            Hạn: {milestone.targetDate}
                          </Text>
                          {milestone.completedDate && (
                            <Text type="success" style={{ marginLeft: 8 }}>
                              Hoàn thành: {milestone.completedDate}
                            </Text>
                          )}
                        </div>
                        <Progress 
                          percent={milestone.progress} 
                          size="small" 
                          style={{ marginTop: 8 }}
                        />
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </TabPane>

            <TabPane tab="Chứng chỉ" key="3">
              <Card>
                <Title level={4}>
                  <TrophyOutlined style={{ marginRight: 8 }} />
                  Danh sách chứng chỉ
                </Title>
                <List
                  itemLayout="horizontal"
                  dataSource={employee.certifications}
                  renderItem={(cert) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />}
                        title={
                          <div>
                            <Text strong>{cert.name}</Text>
                            <Tag 
                              color={cert.status === 'active' ? 'green' : cert.status === 'expired' ? 'red' : 'orange'}
                              style={{ marginLeft: 8 }}
                            >
                              {cert.status === 'active' ? 'Còn hiệu lực' :
                               cert.status === 'expired' ? 'Hết hạn' : 'Chờ duyệt'}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>Tổ chức cấp: {cert.issuer}</div>
                            <div>Ngày cấp: {cert.issueDate}</div>
                            {cert.expiryDate && (
                              <div>Ngày hết hạn: {cert.expiryDate}</div>
                            )}
                            {cert.credentialId && (
                              <div>Mã chứng chỉ: {cert.credentialId}</div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeView;