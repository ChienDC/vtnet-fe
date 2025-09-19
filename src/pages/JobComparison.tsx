import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Select, 
  Button, 
  Table,
  Progress,
  Tag,
  Space,
  Avatar,
  Descriptions,
  Alert,
  Divider,
  List
} from 'antd';
import { 
  ArrowLeftOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { JobPosition, JobComparison as JobComparisonType, ComparisonResult } from '../types';
import { careerRoadmapAPI } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const JobComparison: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [selectedPosition1, setSelectedPosition1] = useState<string>('');
  const [selectedLevel1, setSelectedLevel1] = useState<string>('');
  const [selectedPosition2, setSelectedPosition2] = useState<string>('');
  const [selectedLevel2, setSelectedLevel2] = useState<string>('');
  const [comparison, setComparison] = useState<JobComparisonType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPositions();
    
    // Get params from URL if available
    const pos1 = searchParams.get('pos1');
    const level1 = searchParams.get('level1');
    const pos2 = searchParams.get('pos2');
    const level2 = searchParams.get('level2');
    
    if (pos1) setSelectedPosition1(pos1);
    if (level1) setSelectedLevel1(level1);
    if (pos2) setSelectedPosition2(pos2);
    if (level2) setSelectedLevel2(level2);
    
    if (pos1 && level1 && pos2 && level2) {
      handleCompare(pos1, level1, pos2, level2);
    }
  }, []);

  const loadPositions = async () => {
    try {
      // Load positions from profession 1 (VẬN HÀNH KHAI THÁC)
      const data = await careerRoadmapAPI.getPositionsByProfession('1');
      setPositions(data);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const handleCompare = async (pos1Id: string, level1: string, pos2Id: string, level2: string) => {
    if (!pos1Id || !level1 || !pos2Id || !level2) return;
    
    setLoading(true);
    try {
      const result = await careerRoadmapAPI.comparePositions(pos1Id, level1, pos2Id, level2);
      setComparison(result);
    } catch (error) {
      console.error('Error comparing positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareClick = () => {
    if (selectedPosition1 && selectedLevel1 && selectedPosition2 && selectedLevel2) {
      handleCompare(selectedPosition1, selectedLevel1, selectedPosition2, selectedLevel2);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 75) return '#1890ff';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'active';
    if (score >= 60) return 'normal';
    return 'exception';
  };

  const comparisonColumns: ColumnsType<ComparisonResult> = [
    {
      title: 'Tiêu chí đánh giá',
      dataIndex: 'category',
      key: 'category',
      width: 200,
      render: (category: string) => (
        <Text strong style={{ color: '#374151' }}>{category}</Text>
      ),
    },
    {
      title: comparison?.position1.title || 'Vị trí 1',
      key: 'position1',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Progress 
              percent={record.position1Score} 
              size="small"
              status={getScoreStatus(record.position1Score)}
              strokeColor={getScoreColor(record.position1Score)}
            />
          </div>
          <List
            size="small"
            dataSource={record.position1Details}
            renderItem={(item) => (
              <List.Item style={{ padding: '2px 0', border: 'none' }}>
                <Text style={{ fontSize: '12px' }}>• {item}</Text>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: comparison?.position2.title || 'Vị trí 2',
      key: 'position2',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Progress 
              percent={record.position2Score} 
              size="small"
              status={getScoreStatus(record.position2Score)}
              strokeColor={getScoreColor(record.position2Score)}
            />
          </div>
          <List
            size="small"
            dataSource={record.position2Details}
            renderItem={(item) => (
              <List.Item style={{ padding: '2px 0', border: 'none' }}>
                <Text style={{ fontSize: '12px' }}>• {item}</Text>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      title: 'Khuyến nghị',
      dataIndex: 'recommendation',
      key: 'recommendation',
      render: (recommendation: string) => (
        <Alert
          message={recommendation}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ fontSize: '12px' }}
        />
      ),
    },
  ];

  const getPositionLevels = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.levels : [];
  };

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
        <Title level={2} style={{ display: 'inline-block', margin: 0 }}>
          <SwapOutlined style={{ marginRight: 8 }} />
          So sánh Vị trí Công việc
        </Title>
      </div>

      {/* Selection Panel */}
      <Card className="modern-card" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={10}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Vị trí 1:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn vị trí công việc"
                value={selectedPosition1}
                onChange={setSelectedPosition1}
              >
                {positions.map(position => (
                  <Option key={position.id} value={position.id}>
                    {position.title} ({position.shortCode})
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Text strong>Bậc:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn bậc"
                value={selectedLevel1}
                onChange={setSelectedLevel1}
                disabled={!selectedPosition1}
              >
                {getPositionLevels(selectedPosition1).map(level => (
                  <Option key={level.id} value={level.level}>
                    {level.level} - {level.salaryGrade}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          
          <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<SwapOutlined />}
              onClick={handleCompareClick}
              loading={loading}
              disabled={!selectedPosition1 || !selectedLevel1 || !selectedPosition2 || !selectedLevel2}
              style={{
                height: 60,
                borderRadius: 30,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              So sánh
            </Button>
          </Col>
          
          <Col span={10}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Vị trí 2:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn vị trí công việc"
                value={selectedPosition2}
                onChange={setSelectedPosition2}
              >
                {positions.map(position => (
                  <Option key={position.id} value={position.id}>
                    {position.title} ({position.shortCode})
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Text strong>Bậc:</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Chọn bậc"
                value={selectedLevel2}
                onChange={setSelectedLevel2}
                disabled={!selectedPosition2}
              >
                {getPositionLevels(selectedPosition2).map(level => (
                  <Option key={level.id} value={level.level}>
                    {level.level} - {level.salaryGrade}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Comparison Results */}
      {comparison && (
        <>
          {/* Overview Cards */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Card className="modern-card slide-up">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={64}
                    style={{ 
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      marginRight: 16,
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    {comparison.position1.shortCode}
                  </Avatar>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {comparison.position1.title}
                    </Title>
                    <Tag className="modern-tag tag-blue">
                      {comparison.level1}
                    </Tag>
                  </div>
                </div>
                <Text type="secondary">{comparison.position1.description}</Text>
                
                <Divider />
                
                <div>
                  <Text strong>Kỹ năng chính:</Text>
                  <div style={{ marginTop: 8 }}>
                    {comparison.position1.skills.map((skill, index) => (
                      <Tag key={index} className="modern-tag tag-green" style={{ marginBottom: 4 }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card className="modern-card slide-up">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={64}
                    style={{ 
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      marginRight: 16,
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                  >
                    {comparison.position2.shortCode}
                  </Avatar>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {comparison.position2.title}
                    </Title>
                    <Tag className="modern-tag tag-red">
                      {comparison.level2}
                    </Tag>
                  </div>
                </div>
                <Text type="secondary">{comparison.position2.description}</Text>
                
                <Divider />
                
                <div>
                  <Text strong>Kỹ năng chính:</Text>
                  <div style={{ marginTop: 8 }}>
                    {comparison.position2.skills.map((skill, index) => (
                      <Tag key={index} className="modern-tag tag-green" style={{ marginBottom: 4 }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Detailed Comparison Table */}
          <Card title="Bảng So sánh Chi tiết" className="modern-card">
            <Table
              className="modern-table"
              columns={comparisonColumns}
              dataSource={comparison.comparisonResults}
              rowKey="category"
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>

          {/* Overall Assessment */}
          <Card title="Đánh giá Tổng thể" className="modern-card" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Title level={3} style={{ color: '#3b82f6' }}>
                    {Math.round(comparison.comparisonResults.reduce((sum, r) => sum + r.position1Score, 0) / comparison.comparisonResults.length)}%
                  </Title>
                  <Text>Điểm trung bình - {comparison.position1.title}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Title level={3} style={{ color: '#ef4444' }}>
                    {Math.round(comparison.comparisonResults.reduce((sum, r) => sum + r.position2Score, 0) / comparison.comparisonResults.length)}%
                  </Title>
                  <Text>Điểm trung bình - {comparison.position2.title}</Text>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <Alert
              message="Khuyến nghị chung"
              description={
                <div>
                  <p>Dựa trên kết quả so sánh, để chuyển từ <strong>{comparison.position1.title}</strong> sang <strong>{comparison.position2.title}</strong>, bạn cần:</p>
                  <ul>
                    {comparison.comparisonResults.map((result, index) => (
                      <li key={index}>{result.recommendation}</li>
                    ))}
                  </ul>
                </div>
              }
              type="info"
              showIcon
              icon={<StarOutlined />}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default JobComparison;