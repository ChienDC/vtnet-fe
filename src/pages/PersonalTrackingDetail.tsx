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
  Timeline,
  Tabs,
  Table,
  Space,
  Avatar,
  Descriptions,
  Rate,
  List,
  Badge,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  StarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PersonalCareerTrack, Employee, TrackingStep, CareerEvaluation, Evidence } from '../types';
import { careerAPI, employeeAPI } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const PersonalTrackingDetail: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<PersonalCareerTrack | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState<TrackingStep | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (employeeId) {
      loadData(employeeId);
    }
  }, [employeeId]);

  const loadData = async (empId: string) => {
    try {
      const [trackData, employeeData] = await Promise.all([
        careerAPI.getPersonalCareerTrack(empId),
        employeeAPI.getEmployee(empId)
      ]);
      setTrack(trackData);
      setEmployee(employeeData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'blocked': return 'red';
      default: return 'gray';
    }
  };

  const getStepStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang thực hiện';
      case 'blocked': return 'Bị chặn';
      default: return 'Chưa bắt đầu';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill_development': return <StarOutlined />;
      case 'certification': return <TrophyOutlined />;
      case 'project_experience': return <FileTextOutlined />;
      case 'training': return <FileTextOutlined />;
      case 'mentoring': return <UserOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'skill_development': return 'Phát triển kỹ năng';
      case 'certification': return 'Chứng chỉ';
      case 'project_experience': return 'Kinh nghiệm dự án';
      case 'training': return 'Đào tạo';
      case 'mentoring': return 'Mentoring';
      default: return type;
    }
  };

  const handleUpdateStep = async (stepId: string, updates: Partial<TrackingStep>) => {
    if (!track) return;
    
    try {
      await careerAPI.updateTrackingStep(track.id, stepId, updates);
      message.success('Cập nhật thành công');
      loadData(employeeId!);
    } catch (error) {
      message.error('Không thể cập nhật');
    }
  };

  const evidenceColumns: ColumnsType<Evidence> = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type === 'certificate' ? 'Chứng chỉ' : type === 'document' ? 'Tài liệu' : type === 'project' ? 'Dự án' : 'Phản hồi'}</Tag>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Xác minh',
      key: 'verification',
      render: (_, record) => (
        record.verifiedBy ? (
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            <Text type="success">Đã xác minh</Text>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Bởi: {record.verifiedBy}
            </div>
          </div>
        ) : (
          <Tag color="orange">Chờ xác minh</Tag>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Button size="small" icon={<EyeOutlined />}>
          Xem
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!track || !employee) {
    return <div>Không tìm thấy thông tin lộ trình</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/personal-tracking')}
          style={{ marginRight: 16 }}
        >
          Quay lại
        </Button>
        <Button type="primary" icon={<EditOutlined />}>
          Chỉnh sửa lộ trình
        </Button>
      </div>

      {/* Employee Info Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                src={employee.avatar}
                style={{ marginBottom: 16 }}
              />
              <Title level={4}>{employee.fullName}</Title>
              <Text type="secondary">{employee.employeeCode}</Text>
            </div>
          </Col>
          <Col span={18}>
            <Descriptions title="Thông tin lộ trình" column={2}>
              <Descriptions.Item label="Vị trí hiện tại">
                <Tag color="blue">Position {track.currentPositionId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí mục tiêu">
                <Tag color="green">Position {track.targetPositionId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {new Date(track.startDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Dự kiến hoàn thành">
                {new Date(track.expectedCompletionDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={track.status === 'in_progress' ? 'processing' : 'success'}>
                  {track.status === 'in_progress' ? 'Đang thực hiện' : 'Hoàn thành'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ tổng thể">
                <Progress percent={track.progressPercentage} status="active" />
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Các bước thực hiện" key="1">
          <Card>
            <Timeline>
              {track.trackingSteps.map((step) => (
                <Timeline.Item
                  key={step.id}
                  color={getStepStatusColor(step.status)}
                  dot={getTypeIcon(step.type)}
                >
                  <Card size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={16}>
                        <div style={{ marginBottom: 8 }}>
                          <Title level={5} style={{ margin: 0 }}>
                            {step.title}
                          </Title>
                          <Space style={{ marginTop: 4 }}>
                            <Tag color="blue">{getTypeText(step.type)}</Tag>
                            <Tag color={getStepStatusColor(step.status)}>
                              {getStepStatusText(step.status)}
                            </Tag>
                          </Space>
                        </div>
                        <Paragraph style={{ margin: 0, color: '#666' }}>
                          {step.description}
                        </Paragraph>
                        
                        {step.requirements.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text strong>Yêu cầu:</Text>
                            <ul style={{ marginTop: 4, marginBottom: 0 }}>
                              {step.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.mentor && (
                          <div style={{ marginTop: 8 }}>
                            <Text strong>Mentor: </Text>
                            <Text>{step.mentor}</Text>
                          </div>
                        )}
                      </Col>
                      <Col span={8}>
                        <div style={{ textAlign: 'right' }}>
                          <Progress 
                            type="circle" 
                            percent={step.progress} 
                            width={80}
                            status={step.status === 'completed' ? 'success' : 'active'}
                          />
                          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                            {step.startDate && (
                              <div>Bắt đầu: {new Date(step.startDate).toLocaleDateString('vi-VN')}</div>
                            )}
                            {step.completedDate && (
                              <div>Hoàn thành: {new Date(step.completedDate).toLocaleDateString('vi-VN')}</div>
                            )}
                            <div>
                              Thời gian: {step.actualHours || 0}/{step.estimatedHours}h
                            </div>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Button 
                              size="small" 
                              onClick={() => setSelectedStep(step)}
                            >
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {step.evidence.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <Divider style={{ margin: '12px 0' }} />
                        <Text strong>Bằng chứng ({step.evidence.length}):</Text>
                        <div style={{ marginTop: 8 }}>
                          {step.evidence.map((evidence) => (
                            <Tag key={evidence.id} color="green" style={{ marginBottom: 4 }}>
                              {evidence.title}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="Đánh giá định kỳ" key="2">
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setEvaluationModalVisible(true)}
              >
                Thêm đánh giá mới
              </Button>
            </div>
            
            <List
              itemLayout="vertical"
              dataSource={track.evaluations}
              renderItem={(evaluation) => (
                <List.Item>
                  <Card>
                    <Row gutter={16}>
                      <Col span={16}>
                        <div style={{ marginBottom: 16 }}>
                          <Title level={5}>
                            Đánh giá {evaluation.period}
                          </Title>
                          <Space>
                            <Text>Người đánh giá: <strong>{evaluation.evaluatorName}</strong></Text>
                            <Text type="secondary">
                              {new Date(evaluation.evaluationDate).toLocaleDateString('vi-VN')}
                            </Text>
                          </Space>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <Title level={6}>Đánh giá kỹ năng:</Title>
                          {evaluation.skillAssessments.map((skill, index) => (
                            <div key={index} style={{ marginBottom: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text strong>{skill.skill}</Text>
                                <Text>{skill.currentLevel}/{skill.targetLevel}</Text>
                              </div>
                              <Progress 
                                percent={skill.progress} 
                                size="small"
                                format={() => `${skill.progress}%`}
                              />
                              {skill.notes && (
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {skill.notes}
                                </Text>
                              )}
                            </div>
                          ))}
                        </div>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Title level={6}>Điểm mạnh:</Title>
                            <ul>
                              {evaluation.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                              ))}
                            </ul>
                          </Col>
                          <Col span={12}>
                            <Title level={6}>Cần cải thiện:</Title>
                            <ul>
                              {evaluation.improvementAreas.map((area, index) => (
                                <li key={index}>{area}</li>
                              ))}
                            </ul>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <div style={{ textAlign: 'center' }}>
                          <Title level={3} style={{ color: '#1890ff' }}>
                            {evaluation.overallScore}/5
                          </Title>
                          <Rate disabled value={evaluation.overallScore} />
                          <div style={{ marginTop: 16 }}>
                            <Text type="secondary">Điểm tổng thể</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="Bằng chứng & Tài liệu" key="3">
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<UploadOutlined />}>
                Tải lên bằng chứng
              </Button>
            </div>
            
            <Table
              columns={evidenceColumns}
              dataSource={track.trackingSteps.flatMap(step => step.evidence)}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Step Detail Modal */}
      <Modal
        title="Chi tiết bước thực hiện"
        open={!!selectedStep}
        onCancel={() => setSelectedStep(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedStep(null)}>
            Đóng
          </Button>,
          <Button key="edit" type="primary">
            Chỉnh sửa
          </Button>
        ]}
        width={800}
      >
        {selectedStep && (
          <div>
            <Descriptions column={2}>
              <Descriptions.Item label="Tiêu đề">{selectedStep.title}</Descriptions.Item>
              <Descriptions.Item label="Loại">{getTypeText(selectedStep.type)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStepStatusColor(selectedStep.status)}>
                  {getStepStatusText(selectedStep.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ">
                <Progress percent={selectedStep.progress} size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="Mentor">{selectedStep.mentor || 'Chưa có'}</Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {selectedStep.actualHours || 0}/{selectedStep.estimatedHours}h
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={5}>Mô tả:</Title>
            <Paragraph>{selectedStep.description}</Paragraph>
            
            <Title level={5}>Yêu cầu:</Title>
            <ul>
              {selectedStep.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            
            {selectedStep.evidence.length > 0 && (
              <>
                <Title level={5}>Bằng chứng:</Title>
                <Table
                  columns={evidenceColumns}
                  dataSource={selectedStep.evidence}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonalTrackingDetail;