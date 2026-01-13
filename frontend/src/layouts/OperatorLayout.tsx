import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space } from 'antd';
import {
  SafetyCertificateOutlined,
  LogoutOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  SettingOutlined,
  FileProtectOutlined,
  ApiOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getAuthInfo, clearAuthInfo } from '../store/auth';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const OperatorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthInfo();

  const handleLogout = () => {
    clearAuthInfo();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '治理概览' },
    { key: '/identity', icon: <TeamOutlined />, label: '身份管理' },
    { key: '/connector', icon: <ApiOutlined />, label: '连接器管理' },
    { 
      key: '/catalog', 
      icon: <AppstoreOutlined />, 
      label: '目录管理',
      children: [
        { key: '/catalog/audit', label: '审核登记' },
        { key: '/catalog/portal', label: '产品目录' },
        { key: '/catalog/applications', label: '使用申请' },
      ]
    },
    { key: '/space', icon: <ClusterOutlined />, label: '空间管理' },
    { key: '/contract', icon: <FileProtectOutlined />, label: '数字合约管理' },
    { key: '/settings', icon: <SettingOutlined />, label: '平台配置' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
        width={240} 
        theme="dark"
      >
        <div style={{ height: 64, margin: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SafetyCertificateOutlined style={{ fontSize: 24, marginRight: collapsed ? 0 : 8, color: '#1890ff' }} />
          {!collapsed && <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white', letterSpacing: 1 }}>TDS 管理平台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>运营治理工作台</Title>
          <Space>
            <Dropdown menu={{ items: [{ key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout }] }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<SafetyCertificateOutlined />} />
                <span style={{ fontWeight: 500 }}>{user?.name || '运营管理员'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
          可信数据空间运营管理平台 · 基于 NDI 技术架构 · ©2026
        </Footer>
      </Layout>
    </Layout>
  );
};

export default OperatorLayout;
