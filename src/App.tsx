import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import CareerPaths from './pages/CareerPaths';
import CareerMatrix from './pages/CareerMatrix';
import Departments from './pages/Departments';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import EmployeeView from './pages/EmployeeView';
import PersonalTracking from './pages/PersonalTracking';
import PersonalTrackingDetail from './pages/PersonalTrackingDetail';
import DevelopmentMatrix from './pages/DevelopmentMatrix';
import DevelopmentMatrixDetail from './pages/DevelopmentMatrixDetail';
import CareerRoadmap from './pages/CareerRoadmap';
import CareerRoadmapDetail from './pages/CareerRoadmapDetail';
import JobComparison from './pages/JobComparison';

// Custom theme cho Ant Design
const theme = {
  token: {
    colorPrimary: '#ef4444',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    wireframe: false,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  components: {
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      fontWeight: 600,
    },
    Table: {
      borderRadiusLG: 16,
    },
    Progress: {
      defaultColor: '#ef4444',
    },
  },
};

function App() {
  return (
    <ConfigProvider 
      locale={locale} 
      theme={theme}
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeView />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/personal-tracking" element={<PersonalTracking />} />
            <Route path="/personal-tracking/:employeeId" element={<PersonalTrackingDetail />} />
            <Route path="/career-roadmap" element={<CareerRoadmap />} />
            <Route path="/career-roadmap/:professionId" element={<CareerRoadmapDetail />} />
            <Route path="/job-comparison" element={<JobComparison />} />
            <Route path="/development-matrix" element={<DevelopmentMatrix />} />
            <Route path="/development-matrix/:employeeId" element={<DevelopmentMatrixDetail />} />
            <Route path="/career-matrix" element={<CareerMatrix />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;