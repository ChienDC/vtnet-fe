import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Select, 
  Button, 
  Input,
  Space,
  Statistic,
  List,
  Tag,
  Avatar
} from 'antd';
import { 
  SearchOutlined,
  RiseOutlined,
  EyeOutlined,
  UserOutlined,
  BranchesOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Industry, Profession } from '../types';
import { careerRoadmapAPI } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const CareerRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const data = await careerRoadmapAPI.getIndustries();
      setIndustries(data);
      if (data.length > 0) {
        setSelectedIndustry(data[0].id);
        setProfessions(data[0].professions);
      }
    } catch (error) {
      console.error('Error loading industries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = async (industryId: string) => {
    setSelectedIndustry(industryId);
    try {
      const data = await careerRoadmapAPI.getProfessionsByIndustry(industryId);
      setProfessions(data);
    } catch (error) {
      console.error('Error loading professions:', error);
    }
  };

  const handleViewProfession = (professionId: string) => {
    navigate(`/career-roadmap/${professionId}`);
  };

  const filteredProfessions = professions.filter(profession =>
    profession.name.toLowerCase().includes(searchText.toLowerCase()) ||
    profession.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedIndustryData = industries.find(ind => ind.id === selectedIndustry);

  return (
    <div className="fade-in">
      <Title level={2}>
        <BranchesOutlined style={{ marginRight: 8 }} />
        Lộ trình Nghề nghiệp
      </Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="stat-card bg-illustration-1">
            <div className="stat-card-content">
              <Statistic
                title="Tổng số ngành"
                value={industries.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#ef4444', fontWeight: 'bold', fontSize: '28px' }}
                titleStyle={{ color: '#6b7280', fontWeight: '500' }}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-2">
            <div className="stat-card-content">
              <Statistic
                title="Tổng số nghề"
                value={industries.reduce((sum, ind) => sum + ind.professions.length, 0)}
                prefix={<BranchesOutlined />}
                valueStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '28px' }}
                titleStyle={{ color: '#6b7280', fontWeight: '500' }}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-3">
            <div className="stat-card-content">
              <Statistic
                title="Tổng số vị trí"
                value={industries.reduce((sum, ind) => 
                  sum + ind.professions.reduce((pSum, prof) => pSum + prof.positions.length, 0), 0)}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#10b981', fontWeight: 'bold', fontSize: '28px' }}
                titleStyle={{ color: '#6b7280', fontWeight: '500' }}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card bg-illustration-1">
            <div className="stat-card-content">
              <Statistic
                title="Nghề trong ngành hiện tại"
                value={professions.length}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '28px' }}
                titleStyle={{ color: '#6b7280', fontWeight: '500' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card className="modern-card" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Chọn ngành:</Text>
            </div>
            <Select
              style={{ width: '100%' }}
              value={selectedIndustry}
              onChange={handleIndustryChange}
              loading={loading}
            >
              {industries.map(industry => (
                <Option key={industry.id} value={industry.id}>
                  {industry.name} ({industry.code})
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={16}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Tìm kiếm nghề:</Text>
            </div>
            <Search
              placeholder="Tìm kiếm theo tên nghề hoặc mã nghề"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        {selectedIndustryData && (
          <div style={{ marginTop: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
              {selectedIndustryData.name}
            </Title>
            <Text type="secondary">{selectedIndustryData.description}</Text>
          </div>
        )}
      </Card>

      {/* Professions List */}
      <Card title="Danh sách Nghề" className="modern-card">
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
          dataSource={filteredProfessions}
          renderItem={(profession) => (
            <List.Item>
              <Card
                className="modern-card slide-up"
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewProfession(profession.id)}
                  >
                    Xem chi tiết
                  </Button>
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar 
                      size={64} 
                      style={{ 
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}
                    >
                      {profession.code}
                    </Avatar>
                  }
                  title={
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {profession.name}
                      </Title>
                      <Tag className="modern-tag tag-blue" style={{ marginTop: 4 }}>
                        {profession.code}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
                        {profession.description}
                      </Text>
                      <Space>
                        <Tag className="modern-tag tag-green">
                          {profession.positions.length} vị trí
                        </Tag>
                        <Tag className="modern-tag tag-purple">
                          {profession.positions.reduce((sum, pos) => sum + pos.levels.length, 0)} bậc
                        </Tag>
                      </Space>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CareerRoadmap;