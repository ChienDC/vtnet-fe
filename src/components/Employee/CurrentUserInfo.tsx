import React from 'react';
import { Card, Avatar, Typography, Row, Col, Button } from 'antd';
import { UserOutlined, ArrowRightOutlined, EditOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CurrentUserInfoProps {
  user?: {
    fullName: string;
    avatar?: string;
    currentPosition: string;
    currentLevel: string;
    targetPosition: string;
    targetLevel: string;
  };
}

const CurrentUserInfo: React.FC<CurrentUserInfoProps> = ({ user }) => {
  const defaultUser = {
    fullName: 'Đặng Huyền Trang',
    currentPosition: 'Junior Software Engineer',
    currentLevel: 'Engineering',
    targetPosition: 'Senior Software Engineer',
    targetLevel: 'Engineering',
  };

  const userData = user || defaultUser;

  return (
    <Card
      style={{
        marginBottom: 24,
        background: 'white',
        border: '1px solid #e8edf2',
        borderRadius: 20,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: '28px 32px' }}
    >
      <Row align="middle" gutter={24}>
        <Col>
          <Avatar
            size={72}
            icon={<UserOutlined />}
            src={userData.avatar}
            style={{
              background: 'linear-gradient(135deg, #1769FE 0%, #6AA3F6 100%)',
              boxShadow: '0 4px 12px rgba(23, 105, 254, 0.2)',
            }}
          />
        </Col>
        <Col flex="auto">
          <div style={{ marginBottom: 6 }}>
            <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
              Chào bạn, {userData.fullName}!
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
            Gợi ý được đưa ra dựa trên hồ sơ và sở thích của bạn. <a href="#" style={{ color: '#1769FE' }}>Cập nhật hồ sơ nghề nghiệp</a>
          </Text>
          <Row gutter={16} align="middle">
            <Col>
              <div
                style={{
                  background: '#f8fafc',
                  border: '2px solid #e8edf2',
                  borderRadius: 16,
                  padding: '16px 20px',
                  minWidth: 200,
                }}
              >
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Công việc hiện tại của bạn
                </Text>
                <Title level={5} style={{ margin: 0, color: '#1f2937' }}>
                  {userData.currentPosition}
                </Title>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>{userData.currentLevel}</Text>
                <div style={{ marginTop: 8 }}>
                  <a href="#" style={{ fontSize: 13, color: '#1769FE', fontWeight: 500 }}>
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </Col>
            <Col>
              <ArrowRightOutlined style={{ fontSize: 24, color: '#1769FE' }} />
            </Col>
            <Col>
              <div
                style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                  border: '2px solid #1769FE',
                  borderRadius: 16,
                  padding: '16px 20px',
                  minWidth: 200,
                }}
              >
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  Công việc mong muốn của bạn (3/5)
                </Text>
                <Title level={5} style={{ margin: 0, color: '#1769FE' }}>
                  {userData.targetPosition}
                </Title>
                <Text style={{ fontSize: 13, color: '#1769FE' }}>{userData.targetLevel}</Text>
                <div style={{ marginTop: 8 }}>
                  <a href="#" style={{ fontSize: 13, color: '#1769FE', fontWeight: 500 }}>
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button
            icon={<EditOutlined />}
            style={{
              borderRadius: 12,
              height: 40,
              border: '1px solid #e8edf2',
            }}
          >
            Chỉnh sửa
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default CurrentUserInfo;
