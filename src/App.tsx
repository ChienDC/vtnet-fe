import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';
import MainLayout from './components/Layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import DebugInfo from './components/DebugInfo';
import EnvCheck from './components/EnvCheck';
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

// Custom theme cho Ant Design - Viettel Style
const theme = {
  token: {
    colorPrimary: '#EF0032', // Viettel Red
    colorSuccess: '#489242', // Viettel Green
    colorWarning: '#F59E0B', // Orange
    colorError: '#EF0032', // Viettel Red
    colorInfo: '#176FEE', // Viettel Blue
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
    wireframe: false,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
  },
  components: {
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.08)',
      headerBg: '#FFFFFF',
      colorBgContainer: '#FFFFFF',
    },
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 600,
      primaryShadow: '0 2px 4px rgba(239, 0, 50, 0.2)',
    },
    Table: {
      borderRadiusLG: 12,
      headerBg: '#F8F9FA',
      colorBgContainer: '#FFFFFF',
    },
    Progress: {
      defaultColor: '#EF0032',
    },
    Menu: {
      // itemBg: 'transparent',
      itemSelectedBg: '#000',
      itemSelectedColor: '#EF0032',
      itemHoverBg: '#FFF8F9',
      itemHoverColor: '#EF0032',
    },
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F8F9FA',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    DatePicker: {
      borderRadius: 8,
      controlHeight: 40,
    },
  },
};

function App() {
  return (
    <ErrorBoundary>
      <EnvCheck>
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
          <DebugInfo />
        </ConfigProvider>
      </EnvCheck>
    </ErrorBoundary>
  );
}

export default App;