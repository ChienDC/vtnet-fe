import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { careerAPI, employeeAPI } from '../services/api';

const TestPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing API...');
      
      const [careerData, employeeData] = await Promise.all([
        careerAPI.getCareerPaths(),
        employeeAPI.getEmployees()
      ]);
      
      console.log('Career Data:', careerData);
      console.log('Employee Data:', employeeData);
      
      setData({
        careerPaths: careerData,
        employees: employeeData
      });
      
      message.success('API test thành công!');
    } catch (error) {
      console.error('API Error:', error);
      message.error('API test thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Test API">
        <Button 
          type="primary" 
          onClick={testAPI} 
          loading={loading}
          style={{ marginBottom: 16 }}
        >
          Test API
        </Button>
        
        {data && (
          <div>
            <h3>Career Paths: {data.careerPaths.length}</h3>
            <h3>Employees: {data.employees.length}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestPage;
