import React, { useState } from 'react';
import { message, Typography } from 'antd';
import { 
  ProForm, 
  ProFormText, 
  ProCard
} from '@ant-design/pro-components';
import { KeyOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setAuthInfo } from '../store/auth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 平台仅面向空间运营人员开放登录
      if (values.username === 'admin' && values.password === 'admin123') {
        setAuthInfo({ 
          identityCode: 'admin', 
          role: 'ADMIN', 
          name: '空间运营主管' 
        });
        message.success('运营工作台登录成功');
        navigate('/dashboard');
      } else {
        message.error('账号或密码错误，请联系系统管理员');
      }
    } catch (error: any) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
        <Title level={2} style={{ margin: 0 }}>可信数据空间运营管理平台</Title>
        <Text type="secondary">Trusted Data Space Operation Management Platform</Text>
      </div>

      <div style={{ width: 400 }}>
        <ProCard bordered shadow="md">
          <ProForm
            onFinish={onFinish}
            submitter={{
              searchConfig: { submitText: '登录管理工作台' },
              render: (_, dom) => <div style={{ width: '100%' }}>{dom}</div>,
              submitButtonProps: { size: 'large', style: { width: '100%' }, loading }
            }}
          >
            <ProFormText
              name="username"
              label="管理员账号"
              placeholder="请输入账号"
              rules={[{ required: true }]}
              fieldProps={{ prefix: <UserOutlined /> }}
            />
            <ProFormText.Password
              name="password"
              label="访问密钥"
              placeholder="请输入密码"
              rules={[{ required: true }]}
              fieldProps={{ prefix: <KeyOutlined /> }}
            />
          </ProForm>
          <div style={{ marginTop: 16, textAlign: 'center', color: '#faad14', fontSize: '12px' }}>
            提示：本平台仅供空间运营人员使用。接入主体请通过连接器端进行操作。
          </div>
        </ProCard>
      </div>
    </div>
  );
};

export default Login;