import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// Layouts
import OperatorLayout from './layouts/OperatorLayout';

// Pages
import Login from './pages/Login';
import IdentityManagement from './pages/IdentityManagement';
import CatalogAudit from './pages/CatalogAudit';
import CatalogPortal from './pages/CatalogPortal';
import UsageApplications from './pages/UsageApplications';
import CatalogManagement from './pages/CatalogManagement';
import Contracts from './pages/Contracts';
import SpaceManagement from './pages/SpaceManagement';
import ConnectorManagement from './pages/ConnectorManagement';
import PolicyTemplateManagement from './pages/PolicyTemplateManagement';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const tdsTheme = {
  token: {
    colorPrimary: '#0050B3',
    borderRadius: 6,
    wireframe: false,
    colorBgLayout: '#F5F7FA',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#001529',
    },
    Card: {
      headerFontSize: 16,
    },
    Table: {
      headerBg: '#FAFAFA',
      rowHoverBg: '#F0F5FF',
    }
  }
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={tdsTheme} locale={zhCN}>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Unified Operator Interface */}
        <Route
          element={
            <ProtectedRoute role="ADMIN">
              <OperatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<div>治理大屏开发中...</div>} />
          <Route path="identity" element={<IdentityManagement />} />
          <Route path="connector" element={<ConnectorManagement />} />
          <Route path="catalog/audit" element={<CatalogManagement />} />
          <Route path="catalog/portal" element={<CatalogPortal />} />
          <Route path="catalog/applications" element={<UsageApplications />} />
          <Route path="space" element={<SpaceManagement />} />
          <Route path="/contract" element={<Navigate to="/contract/list" replace />} />
          <Route path="/contract/list" element={<Contracts />} />
          <Route path="/contract/templates" element={<PolicyTemplateManagement />} />
          <Route path="/settings" element={<div>系统全局配置开发中...</div>} />
        </Route>

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;