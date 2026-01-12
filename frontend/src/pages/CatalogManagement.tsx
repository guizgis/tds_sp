import React, { useRef, useState } from 'react';
import { message, Space, Tag, Tabs, Modal, Descriptions, Button } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const CatalogManagement: React.FC = () => {
  const actionRefActive = useRef<ActionType>();
  const actionRefPending = useRef<ActionType>();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem | null>(null);

  const handleAudit = async (id: string, approved: boolean) => {
    try {
      await catalogApi.auditCatalog(id, approved);
      message.success(approved ? '资源已上架发布' : '资源上架申请已拒绝');
      actionRefActive.current?.reload();
      actionRefPending.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ProColumns<CatalogItem>[] = [
    { title: '产品名称', dataIndex: 'name', copyable: true },
    { title: '提供方', dataIndex: 'providerId', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        'PENDING': { text: '待审核', status: 'Processing' },
        'ACTIVE': { text: '已发布', status: 'Success' },
        'CANCELLED': { text: '已驳回/注销', status: 'Error' },
      },
    },
    { title: '提交时间', dataIndex: 'createTime', valueType: 'dateTime' },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => record.status === 'PENDING' ? [
        <a key="view" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a' }} onClick={() => handleAudit(record.id, true)}>通过</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => handleAudit(record.id, false)}>拒绝</a>,
      ] : [
        <a key="view" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>元数据详情</a>,
        record.status === 'ACTIVE' && <a key="stop" style={{ color: '#ff4d4f' }}>下架</a>,
      ],
    },
  ];

  return (
    <PageContainer
      header={{
        title: '目录管理',
        subTitle: '负责数据产品和服务的注册、编目和发现，与国家数据基础设施同步（参考 NDI-TR-2025-06）',
      }}
    >
      <Tabs
        items={[
          {
            key: 'pending',
            label: '产品登记审核',
            children: (
              <ProTable<CatalogItem>
                columns={columns}
                actionRef={actionRefPending}
                request={async (params) => {
                  const res = await catalogApi.search({ status: 'PENDING', keyword: params.name });
                  return { data: res.data, success: true };
                }}
                rowKey="id"
                headerTitle="待审核资源列表"
              />
            ),
          },
          {
            key: 'active',
            label: '产品目录',
            children: (
              <ProTable<CatalogItem>
                columns={columns}
                actionRef={actionRefActive}
                request={async (params) => {
                  const res = await catalogApi.search({ status: 'ACTIVE', keyword: params.name });
                  return { data: res.data, success: true };
                }}
                rowKey="id"
                headerTitle="已发布资源列表"
              />
            ),
          },
        ]}
      />

      <Modal
        title="资源详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailVisible(false)}>关闭</Button>]}
        width={800}
      >
        {selectedCatalog && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="资源 ID">{selectedCatalog.id}</Descriptions.Item>
            <Descriptions.Item label="产品名称">{selectedCatalog.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{selectedCatalog.description}</Descriptions.Item>
            <Descriptions.Item label="提供方 DID">{selectedCatalog.providerId}</Descriptions.Item>
            <Descriptions.Item label="当前状态">
               <Tag color={selectedCatalog.status === 'ACTIVE' ? 'green' : 'orange'}>{selectedCatalog.status}</Tag>
            </Descriptions.Item>
            {/* Display parsed JSON data if exists */}
            {selectedCatalog.fullDataJson && (
               <Descriptions.Item label="元数据详情">
                 <pre style={{maxHeight: 300, overflow: 'auto'}}>
                   {JSON.stringify(JSON.parse(selectedCatalog.fullDataJson), null, 2)}
                 </pre>
               </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default CatalogManagement;