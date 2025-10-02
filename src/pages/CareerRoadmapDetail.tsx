import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Table,
  Space,
  Avatar,
  Descriptions,
  Tooltip,
  Divider,
  Badge,
  Progress
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined,
  RiseOutlined,
  SwapRightOutlined,
  InfoCircleOutlined,
  SwapOutlined,
  StarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Profession, JobPosition, JobLevel, EmployeePosition } from '../types';
import { careerRoadmapAPI, employeeAPI } from '../services/api';

const { Title, Text } = Typography;

const CareerRoadmapDetail: React.FC = () => {
  const { professionId } = useParams<{ professionId: string }>();
  const navigate = useNavigate();
  const [profession, setProfession] = useState<Profession | null>(null);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [employeePosition, setEmployeePosition] = useState<EmployeePosition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (professionId) {
      loadData(professionId);
    }
  }, [professionId]);

  const loadData = async (profId: string) => {
    try {
      const [positionsData, empPositionData] = await Promise.all([
        careerRoadmapAPI.getPositionsByProfession(profId),
        careerRoadmapAPI.getEmployeePosition('1') // Current user
      ]);
      
      setPositions(positionsData);
      setEmployeePosition(empPositionData);
      
      // Get profession info from first position
      if (positionsData.length > 0) {
        // In real app, you'd have a separate API for profession details
        setProfession({
          id: profId,
          name: 'VẬN HÀNH KHAI THÁC',
          code: 'VHKT',
          industryId: '1',
          description: 'Nghề vận hành và khai thác hệ thống',
          positions: positionsData
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    const levelNum = parseInt(level.replace('B', ''));
    if (levelNum <= 11) return '#52c41a';
    if (levelNum <= 13) return '#1890ff';
    if (levelNum <= 15) return '#faad14';
    return '#f5222d';
  };

  const isCurrentPosition = (positionId: string, level: string) => {
    return employeePosition?.currentPositionId === positionId && 
           employeePosition?.currentLevel === level;
  };

  const isTargetPosition = (positionId: string, level: string) => {
    return employeePosition?.targetPositionId === positionId && 
           employeePosition?.targetLevel === level;
  };

  const handleComparePositions = (position1Id: string, level1: string, position2Id: string, level2: string) => {
    navigate(`/job-comparison?pos1=${position1Id}&level1=${level1}&pos2=${position2Id}&level2=${level2}`);
  };

  const levels = ['B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17'];

  const positionColumns: ColumnsType<JobPosition> = [
    {
      title: 'Vị trí công việc',
      key: 'position',
      width: 300,
      fixed: 'left',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              marginRight: 12,
              fontWeight: 'bold'
            }}
          >
            {record.shortCode}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {record.title}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        </div>
      ),
    },
    ...levels.map((level) => ({
      title: level,
      key: level,
      width: 100,
      align: 'center' as const,
      render: (_: any, record: JobPosition) => {
        const jobLevel = record.levels.find(l => l.level === level);
        if (!jobLevel) return null;

        const isCurrent = isCurrentPosition(record.id, level);
        const isTarget = isTargetPosition(record.id, level);
        
        return (
          <Tooltip 
            title={
              <div>
                <div><strong>{record.title}</strong></div>
                <div>Bậc: {jobLevel.level} - {jobLevel.salaryGrade}</div>
                <div>Kinh nghiệm: {jobLevel.experience}</div>
                <div>{jobLevel.description}</div>
                {isCurrent && <div style={{ color: '#1890ff' }}>📍 Vị trí hiện tại</div>}
                {isTarget && <div style={{ color: '#ef4444' }}>🎯 Mục tiêu</div>}
              </div>
            }
          >
            <div
              className="matrix-cell"
              style={{
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getLevelColor(level),
                color: 'white',
                borderRadius: 12,
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: isCurrent ? '3px solid #1890ff' : 
                       isTarget ? '3px solid #ef4444' : 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                position: 'relative'
              }}
              onClick={() => {
                // Handle cell click for more details
              }}
            >
              {record.shortCode}
              {isCurrent && (
                <div style={{ 
                  position: 'absolute', 
                  top: -2, 
                  right: -2,
                  width: 12,
                  height: 12,
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
              {isTarget && (
                <div style={{ 
                  position: 'absolute', 
                  top: -2, 
                  right: -2,
                  width: 12,
                  height: 12,
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </div>
          </Tooltip>
        );
      },
    })),
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            size="small" 
            icon={<InfoCircleOutlined />}
            onClick={() => {
              // Show position details modal
            }}
          >
            Chi tiết
          </Button>
          <Button 
            size="small" 
            icon={<SwapOutlined />}
            onClick={() => {
              // Open comparison modal
            }}
          >
            So sánh
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!profession) {
    return <div>Không tìm thấy thông tin nghề</div>;
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          className="btn-secondary"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/career-roadmap')}
          style={{ marginRight: 16 }}
        >
          Quay lại
        </Button>
        <Button 
          className="btn-primary" 
          type="primary" 
          icon={<SwapOutlined />}
          onClick={() => navigate('/job-comparison')}
        >
          So sánh vị trí
        </Button>
      </div>

      {/* Profession Info */}
      <Card className="modern-card slide-up" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={18}>
            <Descriptions title={`Nghề: ${profession.name}`} column={2}>
              <Descriptions.Item label="Mã nghề">
                <Tag className="modern-tag tag-blue">{profession.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số vị trí">
                <Badge count={positions.length} style={{ backgroundColor: '#52c41a' }} />
              </Descriptions.Item>
              <Descriptions.Item label="Tổng số bậc">
                <Badge 
                  count={positions.reduce((sum, pos) => sum + pos.levels.length, 0)} 
                  style={{ backgroundColor: '#1890ff' }} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {profession.description}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}>
            {employeePosition && (
              <div style={{ textAlign: 'center' }}>
                <Title level={4}>Vị trí của bạn</Title>
                <div style={{ marginBottom: 16 }}>
                  <Tag className="modern-tag tag-blue" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    Hiện tại: {employeePosition.currentLevel}
                  </Tag>
                </div>
                {employeePosition.targetPositionId && (
                  <div style={{ marginBottom: 16 }}>
                    <Tag className="modern-tag tag-red" style={{ fontSize: '14px', padding: '8px 16px' }}>
                      Mục tiêu: {employeePosition.targetLevel}
                    </Tag>
                  </div>
                )}
                <Progress 
                  type="circle" 
                  percent={employeePosition.progress} 
                  width={80}
                  strokeColor={{
                    '0%': '#ef4444',
                    '100%': '#dc2626',
                  }}
                />
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                  Tiến độ phát triển
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Career Matrix */}
      <Card title="Lộ trình Nghề nghiệp" className="modern-card glass-card">
        <div style={{ overflowX: 'auto' }}>
          <Table
            className="modern-table"
            columns={positionColumns}
            dataSource={positions}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
            bordered
          />
        </div>

        {/* Legend */}
        <Divider />
        <Row gutter={16}>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#52c41a', borderRadius: 8 }}></div>
              <Text>B11-B12: Cơ bản</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#1890ff', borderRadius: 8 }}></div>
              <Text>B13-B14: Trung cấp</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#faad14', borderRadius: 8 }}></div>
              <Text>B15-B16: Cao cấp</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#f5222d', borderRadius: 8 }}></div>
              <Text>B17+: Chuyên gia</Text>
            </Space>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={16}>
          <Col span={8}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#1890ff', borderRadius: 8, border: '3px solid #1890ff' }}></div>
              <Text>📍 Vị trí hiện tại của bạn</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#ef4444', borderRadius: 8, border: '3px solid #ef4444' }}></div>
              <Text>🎯 Mục tiêu của bạn</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Career Flow Information */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        {positions.map((position) => (
          <Col span={8} key={position.id} style={{ marginBottom: 16 }}>
            <Card
              className="modern-card slide-up"
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    style={{ 
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      marginRight: 8
                    }}
                  >
                    {position.shortCode}
                  </Avatar>
                  {position.title}
                </div>
              }
              size="small"
            >
              <div style={{ marginBottom: 12 }}>
                <Text strong>Các bậc: </Text>
                <div style={{ marginTop: 4 }}>
                  {position.levels.map((level) => (
                    <Tag 
                      key={level.id} 
                      className="modern-tag" 
                      style={{ 
                        backgroundColor: getLevelColor(level.level), 
                        color: 'white',
                        marginBottom: 4
                      }}
                    >
                      {level.level} - {level.salaryGrade}
                    </Tag>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong>Kỹ năng chính: </Text>
                <div style={{ marginTop: 4 }}>
                  {position.skills.slice(0, 3).map((skill, index) => (
                    <Tag key={index} className="modern-tag tag-green" style={{ marginBottom: 4 }}>
                      {skill}
                    </Tag>
                  ))}
                  {position.skills.length > 3 && (
                    <Tag className="modern-tag tag-purple">+{position.skills.length - 3}</Tag>
                  )}
                </div>
              </div>

              {position.careerFlow.length > 0 && (
                <div>
                  <Text strong>Lộ trình thăng tiến: </Text>
                  {position.careerFlow.map((flow, index) => (
                    <div key={index} style={{ marginTop: 4, fontSize: '12px' }}>
                      <SwapRightOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                      <Text type="secondary">
                        {flow.fromLevel} → {flow.toLevel} ({flow.estimatedTime})
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CareerRoadmapDetail;