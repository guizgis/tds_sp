import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, theme } from 'antd';
import {
  SafetyCertificateOutlined,
  LogoutOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  SettingOutlined,
  FileProtectOutlined,
  ApiOutlined,
  DashboardOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getAuthInfo, clearAuthInfo } from '../store/auth';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const OperatorLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthInfo();
  const { token } = theme.useToken();

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
    { 
      key: '/contract', 
      icon: <FileProtectOutlined />, 
      label: '数字合约管理',
      children: [
        { key: '/contract/list', label: '合约列表' },
        { key: '/contract/templates', label: '策略模板' },
      ]
    },
    { key: '/settings', icon: <SettingOutlined />, label: '平台配置' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
        width={250}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
        }}
      >
        <div style={{ 
          height: 64, 
          margin: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: token.borderRadius,
          backdropFilter: 'blur(4px)'
        }}>
          <SafetyCertificateOutlined style={{ fontSize: 24, marginRight: collapsed ? 0 : 12, color: '#1890ff' }} />
          {!collapsed && (
            <span style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              color: 'white', 
              letterSpacing: 0.5,
              fontFamily: 'Inter, sans-serif'
            }}>
              TDS 运营平台
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/catalog', '/contract']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ background: token.colorBgLayout }}>
        <Header style={{ 
          background: token.colorBgContainer, 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 9,
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
             <Text strong style={{ fontSize: 16 }}>可信数据空间服务平台</Text>
             <div style={{ width: 1, height: 20, background: '#f0f0f0', margin: '0 16px' }} />
             <Text type="secondary" style={{ fontSize: 14 }}>{menuItems.find(i => location.pathname.startsWith(i.key))?.label || '控制台'}</Text>
          </div>
          <Space size={16}>
            <Dropdown menu={{ items: [{ key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: handleLogout }] }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'all 0.3s' }} className="user-dropdown">
                <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{user?.name || '运营管理员'}</span>
                  <span style={{ fontSize: 11, color: '#999' }}>系统超级管理员</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 13, background: 'transparent' }}>
          可信数据空间运营管理平台 · Powered by NDI Architecture · ©2026
        </Footer>
      </Layout>
    </Layout>
  );
};

export default OperatorLayout;