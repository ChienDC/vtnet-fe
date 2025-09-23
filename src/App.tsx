import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/vi_VN';
import { isLoggedIn } from './services/authService';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Layout/MainLayout';
import Employees from './pages/Employees';
import CareerPaths from './pages/CareerPaths';
import PersonalTracking from './pages/PersonalTracking';
import Departments from './pages/Departments';
import Settings from './pages/Settings';

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

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/auth" replace />;
};

function App() {
  console.log('App component rendering...');
  
  return (
    <ConfigProvider 
      locale={locale} 
      theme={theme}
    >
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/career-paths" element={<CareerPaths />} />
                  <Route path="/personal-tracking" element={<PersonalTracking />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;