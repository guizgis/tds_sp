import React, { useRef, useState } from 'react';
import { message, Button, Typography, Modal, Tag } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProductDetailModal } from '../components/ProductDetailModal';

const { Text } = Typography;

const CatalogAudit: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleAuditAction = async (id: string, approved: boolean) => {
    try {
      await catalogApi.auditCatalog(id, approved);
      message.success('操作成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ProColumns<CatalogItem>[] = [
    { title: '产品名称', dataIndex: 'name', copyable: true },
    { 
      title: '提供方', 
      dataIndex: 'providerName', 
      ellipsis: true,
      render: (_, record) => record.providerName || record.providerId 
    },
    {
      title: '当前环节',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '待审核': { text: '待审核', status: 'Processing' },
        'PENDING': { text: '待审核', status: 'Processing' },
        '审核通过': { text: '审核通过', status: 'Warning' },
        'AUDITED': { text: '审核通过', status: 'Warning' },
        '已登记': { text: '已登记', status: 'Default' },
        'REGISTERED': { text: '已登记', status: 'Default' },
        '已发布': { text: '已发布', status: 'Success' },
        'ACTIVE': { text: '已发布', status: 'Success' },
        '已驳回': { text: '已驳回', status: 'Error' },
      },
    },
    { title: '提交时间', dataIndex: 'createTime', valueType: 'dateTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => {
        const actions = [
          <a key="view" onClick={() => { setSelectedProduct(record); setDetailVisible(true); }}>详情</a>
        ];
        
        const status = record.status;
        if (status === '待审核' || status === 'PENDING') {
          actions.push(<a key="pass" style={{color: 'green'}} onClick={() => handleAuditAction(record.id, true)}>通过审核</a>);
          actions.push(<a key="reject" style={{color: 'red'}} onClick={() => handleAuditAction(record.id, false)}>驳回</a>);
        } else if (status === '审核通过' || status === 'AUDITED') {
          actions.push(<Button key="reg" type="primary" size="small" onClick={() => handleAuditAction(record.id, true)}>登记到功能节点</Button>);
        } else if (status === '已登记' || status === 'REGISTERED') {
          actions.push(<a key="publish" onClick={() => handleAuditAction(record.id, true)}>确认发布</a>);
        }
        return actions;
      },
    },
  ];

  return (
    <PageContainer header={{ title: '审核登记', subTitle: '管理接入连接器提交的产品审核及标识登记流转' }}>
      <ProTable<CatalogItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const res = await catalogApi.search({ status: params.status, keyword: params.name });
          return { data: res.data, success: true };
        }}
        rowKey="id"
        headerTitle="治理流程列表"
      />
      <ProductDetailModal 
        visible={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        product={selectedProduct} 
      />
    </PageContainer>
  );
};

export default CatalogAudit;