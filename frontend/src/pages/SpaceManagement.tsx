import React, { useState, useRef } from 'react';
import { Button, message, Space, Tag, Tabs, Modal, Descriptions, Table, Typography } from 'antd';
import { UserOutlined, MonitorOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { getSpaces, getSpaceMembers, reportSpaceStatus } from '../api/space';
import client from '../api/client';
import type { Space as SpaceData, SpaceMember } from '../api/space';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const SpaceManagement: React.FC = () => {
  const actionRefActive = useRef<ActionType>();
  const actionRefPending = useRef<ActionType>();
  const [selectedSpace, setSelectedSpace] = useState<SpaceData | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isMonitoringVisible, setIsMonitoringVisible] = useState(false);
  const [usageLogs, setUsageLogs] = useState<any[]>([]);

  const handleAudit = async (id: string, approved: boolean) => {
    try {
      await client.post(`/api/v1/space/spaces/${id}/audit`, { approved });
      message.success(approved ? '逻辑空间已激活' : '申请已拒绝');
      actionRefActive.current?.reload();
      actionRefPending.current?.reload();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleViewMonitoring = async (space: SpaceData) => {
    try {
      const actualLogs = await client.get(`/api/v1/space/spaces/${space.id}/usage-logs`);
      setUsageLogs(actualLogs.data);
      setSelectedSpace(space);
      setIsMonitoringVisible(true);
    } catch (error) {
      message.error('获取监控数据失败');
    }
  };

  const columns: ProColumns<SpaceData>[] = [
    { title: '空间名称', dataIndex: 'name', copyable: true },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        'PENDING': { text: '待审批', status: 'Processing' },
        'ACTIVE': { text: '运行中', status: 'Success' },
        'INACTIVE': { text: '已停用', status: 'Default' },
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => record.status === 'PENDING' ? [
        <a key="view" onClick={() => { setSelectedSpace(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a' }} onClick={() => handleAudit(record.id, true)}>通过</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => handleAudit(record.id, false)}>拒绝</a>,
      ] : [
        <a key="view" onClick={() => { setSelectedSpace(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="monitor" onClick={() => handleViewMonitoring(record)}><MonitorOutlined /> 运行监测</a>,
        <a key="stop" style={{ color: '#ff4d4f' }}>删除</a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '空间管理',
        subTitle: '负责逻辑可信数据空间的创建、配置和管理，包括成员准入与运行状态监测（参考 NDI-TR-2025-01）',
      }}
    >
      <Tabs
        items={[
          {
            key: 'pending',
            label: '空间创建审核',
            children: (
              <ProTable<SpaceData>
                columns={columns}
                actionRef={actionRefPending}
                request={async (params) => {
                  const data = await getSpaces();
                  return { data: data.filter(s => s.status === 'PENDING'), success: true };
                }}
                rowKey="id"
                headerTitle="待审核空间列表"
              />
            ),
          },
          {
            key: 'active',
            label: '空间运行管理',
            children: (
              <ProTable<SpaceData>
                columns={columns}
                actionRef={actionRefActive}
                request={async (params) => {
                  const data = await getSpaces();
                  return { data: data.filter(s => s.status === 'ACTIVE'), success: true };
                }}
                rowKey="id"
                headerTitle="运行中空间名录"
              />
            ),
          },
        ]}
      />

      <Modal
        title={<span><InfoCircleOutlined /> 空间详情</span>}
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailVisible(false)}>关闭</Button>]}
        width={700}
      >
        {selectedSpace && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="空间 ID">{selectedSpace.id}</Descriptions.Item>
            <Descriptions.Item label="空间名称">{selectedSpace.name}</Descriptions.Item>
            <Descriptions.Item label="当前状态">
              <Tag color={selectedSpace.status === 'ACTIVE' ? 'green' : (selectedSpace.status === 'PENDING' ? 'orange' : 'default')}>
                {selectedSpace.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="支持策略">
              {selectedSpace.usagePolicies?.map(p => <Tag key={p} color="blue">{p}</Tag>) || '未配置'}
            </Descriptions.Item>
            <Descriptions.Item label="包含资源列表">
              {selectedSpace.resourceIds?.map(r => <Tag key={r}>{r}</Tag>) || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label="描述">{selectedSpace.description || '无描述'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedSpace.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={<span><MonitorOutlined /> 空间运行实时监测 - {selectedSpace?.name}</span>}
        open={isMonitoringVisible}
        onCancel={() => setIsMonitoringVisible(false)}
        width={900}
        footer={[<Button key="close" onClick={() => setIsMonitoringVisible(false)}>关闭</Button>]}
      >
        <Table
          dataSource={usageLogs}
          rowKey="id"
          size="small"
          columns={[
            { title: '时间', dataIndex: 'timestamp', key: 'timestamp' },
            { title: '执行主体', dataIndex: 'participantId', key: 'participantId' },
            { title: '操作行为', dataIndex: 'action', key: 'action' },
            { 
              title: '合规状态', 
              dataIndex: 'status', 
              key: 'status',
              render: (s) => <Tag color={s === 'SUCCESS' ? 'green' : 'red'}>{s}</Tag>
            },
            { title: '存证哈希', dataIndex: 'evidenceHash', key: 'evidenceHash', ellipsis: true },
          ]}
        />
      </Modal>
    </PageContainer>
  );
};

export default SpaceManagement;