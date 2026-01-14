import React, { useRef, useState } from 'react';
import { Button, message, Space, Tag, Tabs, Modal, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
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

  const commonTableProps = {
    cardBordered: false,
    options: { density: true, fullScreen: true, setting: true },
    search: { 
      filterType: 'query', 
      span: 6, 
      labelWidth: 'auto',
      className: 'glass-card',
      style: { padding: '24px', borderRadius: 12, marginBottom: 24, background: 'rgba(255,255,255,0.4)' }
    } as const,
  };

  const auditColumns: ProColumns<any>[] = [
    { 
      title: '申请主体', 
      dataIndex: 'name', 
      copyable: true,
      render: (text) => <Space><UserOutlined style={{color: '#1890ff'}}/>{text}</Space>
    },
    { 
      title: '主体类型', 
      dataIndex: 'type', 
      valueEnum: {
        'Person': { text: '个人' },
        'Enterprise': { text: '法人' },
        'Operator': { text: '经办人' },
      }
    },
    { 
      title: '身份标识 (DID)', 
      dataIndex: 'identityCode', 
      ellipsis: true, 
      search: false,
      render: (id) => <code style={{ color: '#0050b3' }}>{id}</code>
    },
    { title: '申请时间', dataIndex: 'submitTime', valueType: 'dateTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a', fontWeight: 500 }} onClick={() => handleAudit(record.identityCode, true)}>准许</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => handleAudit(record.identityCode, false)}>拒绝</a>,
      ],
    },
  ];

  const subjectColumns: ProColumns<any>[] = [
    { 
      title: '主体名称', 
      dataIndex: 'name', 
      copyable: true,
      render: (text) => <Space><ContainerOutlined style={{color: '#1890ff'}}/>{text}</Space>
    },
    { 
      title: '主体类型', 
      dataIndex: 'type', 
      valueEnum: {
        'Person': { text: '个人' },
        'Enterprise': { text: '法人' },
        'Operator': { text: '经办人' },
      }
    },
    { 
      title: '身份标识', 
      dataIndex: 'identityCode', 
      ellipsis: true, 
      render: (id) => <code style={{ color: '#0050b3' }}>{id}</code> 
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      valueEnum: {
        '1': { text: '正常', status: 'Success' },
        '0': { text: '禁用', status: 'Error' },
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => [
        <a key="view" onClick={() => { setSelectedIdentity(record); setIsDetailVisible(true); }}>详情</a>,
        record.status === '1' ? (
          <a key="stop" style={{ color: '#faad14' }} onClick={() => handleUpdateStatus(record.identityCode, '0')}>停用</a>
        ) : (
          <a key="start" style={{ color: '#52c41a' }} onClick={() => handleUpdateStatus(record.identityCode, '1')}>启用</a>
        ),
        <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDeregister(record.identityCode)}>注销</a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '身份标识管理',
        subTitle: '全域数字身份准入、认证与生命周期管控',
        ghost: true,
      }}
    >
      <Tabs
        type="card"
        tabBarStyle={{ marginBottom: 24, borderBottom: 'none' }}
        items={[
          {
            key: 'audit',
            label: '身份注册审核',
            children: (
              <div className="glass-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <ProTable
                  {...commonTableProps}
                  columns={auditColumns}
                  actionRef={actionRefAudit}
                  request={async () => {
                    const res = await identityApi.listRegistrations('0');
                    return { data: res.data.data, success: true };
                  }}
                  rowKey="identityCode"
                  headerTitle={<span style={{ fontWeight: 600 }}>申请列表</span>}
                />
              </div>
            ),
          },
          {
            key: 'subjects',
            label: '已注册主体',
            children: (
              <div className="glass-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <ProTable
                  {...commonTableProps}
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
                  headerTitle={<span style={{ fontWeight: 600 }}>全域主体库</span>}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        title="身份详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[<Button key="close" type="primary" style={{borderRadius: 6}} onClick={() => setIsDetailVisible(false)}>关闭</Button>]}
        width={800}
        bodyStyle={{maxHeight: '70vh', overflowY: 'auto'}}
        destroyOnClose
      >
        {selectedIdentity && (
          <Descriptions bordered column={1} size="small" className="glass-card" style={{borderRadius: 8}}>
            <Descriptions.Item label="主体名称"><span style={{fontWeight: 600}}>{selectedIdentity.name}</span></Descriptions.Item>
            <Descriptions.Item label="主体类型"><Tag color="blue" bordered={false}>{selectedIdentity.type}</Tag></Descriptions.Item>
            <Descriptions.Item label="身份标识 (DID)"><code>{selectedIdentity.identityCode}</code></Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge 
                status={selectedIdentity.status === '1' ? 'success' : (selectedIdentity.status === '0' ? 'error' : 'processing')} 
                text={selectedIdentity.status === '1' ? '已激活' : (selectedIdentity.status === '0' ? '已停用' : '待审核')} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">{selectedIdentity.submitTime}</Descriptions.Item>
            {selectedIdentity.dataJson && (
               <>
                 <Descriptions.Item label="基础信息">
                   <pre style={{maxHeight: 200, overflow: 'auto', background: '#f8fafc', padding: 12, borderRadius: 8}}>
                     {JSON.stringify(JSON.parse(selectedIdentity.dataJson).baseInfo || {}, null, 2)}
                   </pre>
                 </Descriptions.Item>
                 <Descriptions.Item label="扩展信息">
                   <pre style={{maxHeight: 200, overflow: 'auto', background: '#f8fafc', padding: 12, borderRadius: 8}}>
                     {JSON.stringify(JSON.parse(selectedIdentity.dataJson).extendInfo || {}, null, 2)}
                   </pre>
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
