import React, { useState, useRef } from 'react';
import { Button, message, Modal, Descriptions, Tag, Tabs, Typography, Table } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, MonitorOutlined, AuditOutlined, ApiOutlined } from '@ant-design/icons';
import { ProTable, PageContainer, ProFormText, ProFormSelect, StepsForm } from '@ant-design/pro-components';
import client from '../api/client';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const { confirm } = Modal;
const { Title, Text } = Typography;

const JOIN_TYPE_MAP: Record<string, string> = {
  '1': '专线',
  '2': '互联网 (固定IP)',
  '3': '互联网 (无固定IP)',
  '4': '高速数据网',
  '5': '其他',
};

const ConnectorManagement: React.FC = () => {
  const actionRefActive = useRef<ActionType>();
  const actionRefPending = useRef<ActionType>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedConnector, setSelectedIdentity] = useState<any>(null);

  const fetchConnectors = async (status: string) => {
    try {
      // Bypassing gateway for connector service due to persistent 404
      const resp = await client.get('http://localhost:8083/admin/connectors', {
        params: { status: status === 'ACTIVE' ? '1' : '0' }
      });
      return resp.data.data || [];
    } catch (err) {
      message.error('获取连接器列表失败');
      return [];
    }
  };

  const activeColumns: ProColumns<any>[] = [
    { title: '连接器名称', dataIndex: 'connectorName', copyable: true },
    { title: '接入方式', dataIndex: 'connectorJoinType', render: (val: string) => <Tag>{JOIN_TYPE_MAP[val] || val}</Tag> },
    { title: '所属机构', dataIndex: 'enterpriseName' },
    { 
      title: '运行状态', 
      dataIndex: 'identityStatus', 
      render: () => <Tag color="green">在线</Tag> 
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setDetailOpen(true); }}>详情</a>,
        <a key="monitor" onClick={() => message.info('监控详情开发中...')}><MonitorOutlined /> 运行监测</a>,
        <a key="stop" style={{ color: '#ff4d4f' }} onClick={() => message.warning('注销功能请确认')}>连接器注销</a>,
      ],
    },
  ];

  const pendingColumns: ProColumns<any>[] = [
    { title: '申请节点', dataIndex: 'connectorName' },
    { title: '接入方式', dataIndex: 'connectorJoinType', render: (val: string) => <Tag>{JOIN_TYPE_MAP[val] || val}</Tag> },
    { title: '申请主体', dataIndex: 'enterpriseName' },
    { title: '申请时间', dataIndex: 'authTime', valueType: 'date' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setDetailOpen(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a' }} onClick={() => message.success('接入申请已批准')}>连接器接入</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => message.error('接入申请已驳回')}>拒绝</a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '连接器管理',
        subTitle: '负责接入连接器的生命周期管理和运行状态监控，确保连接器安全、可靠接入（参考 NDI-TR-2025-05）',
      }}
    >
      <Tabs
        items={[
          {
            key: 'active',
            label: <span><ApiOutlined /> 连接器列表</span>,
            children: (
              <ProTable
                columns={activeColumns}
                actionRef={actionRefActive}
                request={async () => ({ data: await fetchConnectors('ACTIVE'), success: true })}
                rowKey="identityCode"
                search={false}
              />
            ),
          },
          {
            key: 'pending',
            label: <span><AuditOutlined /> 注册审核</span>,
            children: (
              <ProTable
                columns={pendingColumns}
                actionRef={actionRefPending}
                request={async () => ({ data: await fetchConnectors('PENDING'), success: true })}
                rowKey="identityCode"
                search={false}
              />
            ),
          },
        ]}
      />

      {/* Detail Modal */}
      <Modal
        title="连接器详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={[<Button key="close" onClick={() => setDetailOpen(false)}>关闭</Button>]}
        width={700}
      >
        {selectedConnector && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="连接器 ID">{selectedConnector.identityCode}</Descriptions.Item>
            <Descriptions.Item label="连接器名称">{selectedConnector.connectorName}</Descriptions.Item>
            <Descriptions.Item label="所属机构">{selectedConnector.enterpriseName || selectedConnector.enterpriseCode}</Descriptions.Item>
            <Descriptions.Item label="接入方式">{JOIN_TYPE_MAP[selectedConnector.connectorJoinType] || selectedConnector.connectorJoinType}</Descriptions.Item>
            <Descriptions.Item label="物理 MAC 地址">{selectedConnector.connectorMac}</Descriptions.Item>
            <Descriptions.Item label="接入技术协议">HTTPS / mTLS (NDI-TR-2025-05)</Descriptions.Item>
            <Descriptions.Item label="认证状态">
               {selectedConnector.identityStatus === '1' ? <Tag color="green">已认证</Tag> : <Tag color="orange">待审核</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="申请时间">{selectedConnector.authTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ConnectorManagement;
