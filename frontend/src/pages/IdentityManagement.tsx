import React, { useRef, useState } from 'react';
import { Button, message, Space, Tag, Tabs, Modal, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined, PlayCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { identityApi } from '../api/identity';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const IdentityManagement: React.FC = () => {
  const actionRefAudit = useRef<ActionType>();
  const actionRefSubjects = useRef<ActionType>();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<any>(null);

  const handleAudit = async (id: string, approved: boolean) => {
    try {
      await identityApi.auditRegistration(id, approved);
      message.success(approved ? '准入审核已通过' : '申请已拒绝');
      actionRefAudit.current?.reload();
      actionRefSubjects.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await identityApi.updateIdentityStatus(id, newStatus);
      message.success(newStatus === '1' ? '主体已启用' : '主体已停用');
      actionRefSubjects.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleDeregister = (id: string) => {
    Modal.confirm({
      title: '确认注销该主体身份？',
      content: '注销后该 DID 将在全域范围内标记为失效，相关连接器将无法继续参与数据交换。',
      okText: '确定注销',
      okType: 'danger',
      onOk: async () => {
        try {
          await identityApi.deregisterIdentity(id);
          message.success('主体已注销');
          actionRefSubjects.current?.reload();
        } catch (error) {
          message.error('注销失败');
        }
      },
    });
  };

  const auditColumns: ProColumns<any>[] = [
    { title: '申请主体', dataIndex: 'name', copyable: true },
    { 
      title: '主体类型', 
      dataIndex: 'type', 
      valueEnum: {
        'Person': { text: '个人' },
        'Enterprise': { text: '法人' },
        'Operator': { text: '经办人' },
      }
    },
    { title: '身份标识 (DID)', dataIndex: 'identityCode', ellipsis: true, search: false },
    { title: '申请时间', dataIndex: 'submitTime', valueType: 'dateTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a' }} onClick={() => handleAudit(record.identityCode, true)}>准许准入</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => handleAudit(record.identityCode, false)}>拒绝</a>,
      ],
    },
  ];

  const subjectColumns: ProColumns<any>[] = [
    { title: '主体名称', dataIndex: 'name', copyable: true },
    { 
      title: '主体类型', 
      dataIndex: 'type', 
      valueEnum: {
        'Person': { text: '个人' },
        'Enterprise': { text: '法人' },
        'Operator': { text: '经办人' },
      }
    },
    { title: '身份标识 (DID)', dataIndex: 'identityCode', ellipsis: true, render: (id) => <code>{id}</code> },
    { 
      title: '状态', 
      dataIndex: 'status', 
      valueEnum: {
        '1': { text: '正常', status: 'Success' },
        '0': { text: '禁用', status: 'Error' },
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setIsDetailVisible(true); }}>详情</a>,
        record.status === '1' ? (
          <a key="stop" style={{ color: '#faad14' }} onClick={() => handleUpdateStatus(record.identityCode, '0')}>停用</a>
        ) : (
          <a key="start" style={{ color: '#52c41a' }} onClick={() => handleUpdateStatus(record.identityCode, '1')}>启用</a>
        ),
        <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDeregister(record.identityCode)}>身份注销</a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '身份管理',
        subTitle: '负责用户身份的注册、认证、更新和注销，确保主体可信且可追溯（参考 NDI-TR-2025-03）',
      }}
    >
      <Tabs
        items={[
          {
            key: 'audit',
            label: '身份注册审核',
            children: (
              <ProTable
                columns={auditColumns}
                actionRef={actionRefAudit}
                request={async () => {
                  const res = await identityApi.listRegistrations('0');
                  return { data: res.data.data, success: true };
                }}
                rowKey="identityCode"
                search={false}
              />
            ),
          },
          {
            key: 'subjects',
            label: '已注册身份管理',
            children: (
              <ProTable
                columns={subjectColumns}
                actionRef={actionRefSubjects}
                request={async (params) => {
                  const res = await identityApi.listRegistrations('1');
                  return {
                    data: (res.data.data || []).filter((item: any) => 
                      !params.name || item.name.includes(params.name)
                    ),
                    success: true,
                  };
                }}
                rowKey="identityCode"
              />
            ),
          },
        ]}
      />

      <Modal
        title="身份详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailVisible(false)}>关闭</Button>]}
        width={800}
      >
        {selectedIdentity && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="主体名称">{selectedIdentity.name}</Descriptions.Item>
            <Descriptions.Item label="主体类型">{selectedIdentity.type}</Descriptions.Item>
            <Descriptions.Item label="身份标识 (DID)">{selectedIdentity.identityCode}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedIdentity.status === '1' ? 'green' : (selectedIdentity.status === '0' ? 'red' : 'orange')}>
                {selectedIdentity.status === '1' ? '已激活' : (selectedIdentity.status === '0' ? '已停用' : '待审核')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">{selectedIdentity.submitTime}</Descriptions.Item>
            {/* Show parsed JSON data if available */}
            {selectedIdentity.dataJson && (
               <>
                 <Descriptions.Item label="基础信息">
                   <pre style={{maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(JSON.parse(selectedIdentity.dataJson).baseInfo || {}, null, 2)}</pre>
                 </Descriptions.Item>
                 <Descriptions.Item label="扩展信息">
                   <pre style={{maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(JSON.parse(selectedIdentity.dataJson).extendInfo || {}, null, 2)}</pre>
                 </Descriptions.Item>
               </>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default IdentityManagement;