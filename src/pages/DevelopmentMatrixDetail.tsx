import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Progress, 
  Tag, 
  Button, 
  Table,
  Space,
  Avatar,
  Descriptions,
  List,
  Badge,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EditOutlined,
  PlusOutlined,
  StarOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PersonalDevelopmentMatrix, Employee, PositionRequirement, DevelopmentLevel } from '../types';
import { careerAPI, employeeAPI } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const DevelopmentMatrixDetail: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [matrix, setMatrix] = useState<PersonalDevelopmentMatrix | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [levels, setLevels] = useState<DevelopmentLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<PositionRequirement | null>(null);

  useEffect(() => {
    if (employeeId) {
      loadData(employeeId);
    }
  }, [employeeId]);

  const loadData = async (empId: string) => {
    try {
      const [matrixData, employeeData, levelsData] = await Promise.all([
        careerAPI.getPersonalDevelopmentMatrix(empId),
        employeeAPI.getEmployee(empId),
        careerAPI.getDevelopmentLevels()
      ]);
      setMatrix(matrixData);
      setEmployee(employeeData);
      setLevels(levelsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#52c41a';
      case 'current': return '#1890ff';
      case 'target': return '#faad14';
      case 'future': return '#d9d9d9';
      default: return '#f0f0f0';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'current': return 'Hiện tại';
      case 'target': return 'Mục tiêu';
      case 'future': return 'Tương lai';
      default: return 'Không áp dụng';
    }
  };

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'skill': return <StarOutlined />;
      case 'certification': return <TrophyOutlined />;
      case 'experience': return <FileTextOutlined />;
      case 'training': return <BookOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getRequirementTypeText = (type: string) => {
    switch (type) {
      case 'skill': return 'Kỹ năng';
      case 'certification': return 'Chứng chỉ';
      case 'experience': return 'Kinh nghiệm';
      case 'training': return 'Đào tạo';
      default: return type;
    }
  };

  const requirementColumns: ColumnsType<PositionRequirement> = [
    {
      title: 'Yêu cầu',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getRequirementIcon(record.type)}
          <span style={{ marginLeft: 8 }}>{title}</span>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getRequirementTypeText(type)}</Tag>
      ),
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress 
          percent={record.progress} 
          size="small"
          status={record.status === 'completed' ? 'success' : 'active'}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          'completed': 'success',
          'in_progress': 'processing',
          'not_started': 'default'
        };
        const texts = {
          'completed': 'Hoàn thành',
          'in_progress': 'Đang thực hiện',
          'not_started': 'Chưa bắt đầu'
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {texts[status as keyof typeof texts]}
          </Tag>
        );
      },
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!matrix || !employee) {
    return <div>Không tìm thấy thông tin lộ trình phát triển</div>;
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          className="btn-secondary"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/development-matrix')}
          style={{ marginRight: 16 }}
        >
          Quay lại
        </Button>
        <Button className="btn-primary" type="primary" icon={<EditOutlined />}>
          Chỉnh sửa lộ trình
        </Button>
      </div>

      {/* Employee Info Card */}
      <Card className="modern-card slide-up" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                src={employee.avatar}
                style={{ 
                  marginBottom: 16,
                  boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)',
                  border: '4px solid #fef2f2'
                }}
              />
              <Title level={4}>{employee.fullName}</Title>
              <Text type="secondary">{employee.employeeCode}</Text>
            </div>
          </Col>
          <Col span={18}>
            <Descriptions title="Thông tin lộ trình phát triển" column={2}>
              <Descriptions.Item label="Phòng ban">
                <Tag className="modern-tag tag-blue">{matrix.department}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên môn">
                <Tag className="modern-tag tag-green">{matrix.profession}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Bậc hiện tại">
                <Tag className="modern-tag tag-blue">{matrix.currentLevel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Bậc mục tiêu">
                <Tag className="modern-tag tag-red">{matrix.targetLevel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(matrix.createdAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật cuối">
                {new Date(matrix.updatedAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Development Matrix Visualization */}
      <Card title="Lộ trình Phát triển Cá nhân" className="modern-card glass-card" style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 800 }}>
            {/* Header with levels */}
            <Row gutter={8} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <div style={{ 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 12,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}>
                  Vị trí
                </div>
              </Col>
              {levels.map((level) => (
                <Col span={3} key={level.code}>
                  <div style={{ 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 12,
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}>
                    {level.code}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Position rows */}
            {matrix.positions.map((position, index) => (
              <Row gutter={8} key={position.id} style={{ marginBottom: 8 }}>
                <Col span={6}>
                  <div style={{ 
                    height: 60, 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '8px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: 12,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}>
                    {position.title}
                  </div>
                </Col>
                {levels.map((level) => {
                  const isPositionLevel = position.level.includes(level.code);
                  const cellContent = isPositionLevel ? 
                    (position.status === 'current' ? 'HIỆN TẠI' :
                     position.status === 'target' ? 'MỤC TIÊU' :
                     position.status === 'completed' ? 'HOÀN THÀNH' : '') : '';
                  
                  return (
                    <Col span={3} key={level.code}>
                      <Tooltip title={isPositionLevel ? `${position.title} - ${getStatusText(position.status)} (${position.progress}%)` : ''}>
                        <div className="matrix-cell" style={{ 
                          height: 60, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: isPositionLevel ? getStatusColor(position.status) : '#f5f5f5',
                          color: isPositionLevel ? 'white' : '#ccc',
                          borderRadius: 12,
                          fontSize: '10px',
                          fontWeight: 'bold',
                          cursor: isPositionLevel ? 'pointer' : 'default',
                          border: position.status === 'current' ? '3px solid #3b82f6' : 
                                 position.status === 'target' ? '3px solid #ef4444' : 'none',
                          boxShadow: isPositionLevel ? '0 4px 8px rgba(0, 0, 0, 0.15)' : 'none',
                        }}>
                          {cellContent}
                          {isPositionLevel && position.progress < 100 && (
                            <div style={{ 
                              position: 'absolute', 
                              bottom: 2, 
                              right: 2, 
                              fontSize: '8px',
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              padding: '1px 3px',
                              borderRadius: 4
                            }}>
                              {position.progress}%
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    </Col>
                  );
                })}
              </Row>
            ))}
          </div>
        </div>

        {/* Legend */}
        <Divider />
        <Row gutter={16}>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#10b981', borderRadius: 8 }}></div>
              <Text>Đã hoàn thành</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#3b82f6', borderRadius: 8, border: '3px solid #3b82f6' }}></div>
              <Text>Vị trí hiện tại</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#ef4444', borderRadius: 8, border: '3px solid #ef4444' }}></div>
              <Text>Mục tiêu</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: 16, height: 16, backgroundColor: '#d4d4d4', borderRadius: 8 }}></div>
              <Text>Tương lai</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Position Details */}
      <Row gutter={16}>
        {matrix.positions.map((position) => (
          <Col span={8} key={position.id} style={{ marginBottom: 16 }}>
            <Card
              className="modern-card slide-up"
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{position.title}</span>
                  <Tag className="modern-tag" style={{ backgroundColor: getStatusColor(position.status), color: 'white' }}>
                    {getStatusText(position.status)}
                  </Tag>
                </div>
              }
              size="small"
            >
              <div style={{ marginBottom: 16 }}>
                <Text strong>Tiến độ: </Text>
                <Progress 
                  className="modern-progress"
                  percent={position.progress} 
                  size="small"
                  status={position.status === 'completed' ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#ef4444',
                    '100%': '#dc2626',
                  }}
                />
              </div>

              {position.completedDate && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Hoàn thành: </Text>
                  <Text>{new Date(position.completedDate).toLocaleDateString('vi-VN')}</Text>
                </div>
              )}

              {position.estimatedDate && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Dự kiến: </Text>
                  <Text>{new Date(position.estimatedDate).toLocaleDateString('vi-VN')}</Text>
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Text strong>Yêu cầu ({position.requirements.length}):</Text>
                <List
                  size="small"
                  dataSource={position.requirements}
                  renderItem={(req) => (
                    <List.Item style={{ padding: '4px 0' }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          {getRequirementIcon(req.type)}
                          <Text style={{ marginLeft: 4, fontSize: '12px' }}>{req.title}</Text>
                        </div>
                        <Progress 
                          className="modern-progress"
                          percent={req.progress} 
                          size="small"
                          showInfo={false}
                          status={req.status === 'completed' ? 'success' : 'active'}
                          strokeColor={{
                            '0%': '#ef4444',
                            '100%': '#dc2626',
                          }}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Detailed Requirements Table */}
      <Card title="Chi tiết Yêu cầu" className="modern-card" style={{ marginTop: 16 }}>
        <Table
          className="modern-table"
          columns={requirementColumns}
          dataSource={matrix.positions.flatMap(pos => 
            pos.requirements.map(req => ({ ...req, positionTitle: pos.title }))
          )}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DevelopmentMatrixDetail;