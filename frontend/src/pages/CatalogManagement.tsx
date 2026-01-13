import React, { useRef, useState } from 'react';
import { message, Tag, Button, Tabs, Space } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProductDetailModal } from '../components/ProductDetailModal';

const CatalogManagement: React.FC = () => {
  const actionRefAudit = useRef<ActionType>();
  const actionRefRegister = useRef<ActionType>();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem | null>(null);

  const handleAction = async (id: string, approved: boolean, ref: React.MutableRefObject<ActionType | undefined>) => {
    try {
      await catalogApi.auditCatalog(id, approved);
      message.success('操作成功');
      ref.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

    const columns: ProColumns<CatalogItem>[] = [
      { title: '产品名称', dataIndex: 'name', copyable: true, ellipsis: true, width: 180, fixed: 'left' },
      { 
        title: '主题分类', 
        dataIndex: 'topicCategory',
        width: 100,
        valueEnum: {
          'A0000': { text: '综合政务' },
          'B0000': { text: '经济管理' },
          'C0000': { text: '科技教育' },
          'D0000': { text: '文化卫生' },
        }
      },
      { 
        title: '数据来源', 
        dataIndex: 'sourceType',
        width: 100,
        valueEnum: {
          '001': { text: '原始取得' },
          '002': { text: '收集取得' },
          '003': { text: '交易取得' },
        }
      },
      {
        title: '安全级别',
        dataIndex: 'securityLevel',
        width: 90,
        render: (val) => <Tag color="blue">{`L${val || '2'}`}</Tag>
      },
      { 
        title: '提供方', 
        dataIndex: 'providerName', 
        ellipsis: true,
        width: 180,
        render: (_, record) => record.providerName || record.providerId 
      },
      { title: '提交时间', dataIndex: 'createTime', valueType: 'dateTime', search: false, width: 160 },
    ];
  
    const auditColumns: ProColumns<CatalogItem>[] = [
      ...columns,
      {
        title: '操作',
        valueType: 'option',
        width: 180,
        fixed: 'right',
        render: (_, record) => [
          <Button key="view" type="link" size="small" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</Button>,
          <Button key="pass" type="primary" size="small" ghost onClick={() => handleAction(record.id, true, actionRefAudit)}>通过审核</Button>,
          <Button key="reject" type="primary" danger size="small" ghost onClick={() => handleAction(record.id, false, actionRefAudit)}>驳回</Button>,
        ],
      },
    ];
  
    const registerColumns: ProColumns<CatalogItem>[] = [
      ...columns,
      {
        title: '产品标识',
        dataIndex: 'id',
        ellipsis: true,
        width: 220,
        render: (id, record) => (record.status === '已登记' || record.status === '已发布') ? <code>{id}</code> : <Tag color="default">未分配</Tag>
      },
      {
        title: '状态',
        dataIndex: 'status',
        hideInSearch: true,
        width: 100,
        valueEnum: {
          '审核通过': { text: '待登记', status: 'Warning' },
          '已登记': { text: '已登记', status: 'Processing' },
          '已发布': { text: '已发布', status: 'Success' },
        }
      },
      {
        title: '操作',
        valueType: 'option',
        width: 220,
        fixed: 'right',
        render: (_, record) => {
          const actions = [
            <Button key="view" type="link" size="small" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</Button>
          ];
          
          if (record.status === '审核通过') {
            actions.push(<Button key="reg" type="primary" size="small" onClick={() => handleAction(record.id, true, actionRefRegister)}>向节点登记</Button>);
          } else if (record.status === '已登记' || record.status === '已发布') {
            actions.push(<Button key="update" type="link" size="small">更新</Button>);
            actions.push(<Button key="revoke" type="link" danger size="small">撤销</Button>);
            if (record.status === '已登记') {
              actions.push(<Button key="publish" type="primary" ghost size="small" onClick={() => handleAction(record.id, true, actionRefRegister)}>发布</Button>);
            }
          }
          return actions;
        },
      },
    ];
  
    return (
      <PageContainer
        header={{
          title: '产品审核与登记',
          subTitle: '独立管理产品的准入审核与 NDI 标识登记流程',
        }}
      >
        <Tabs
          items={[
            {
              key: 'audit',
              label: '1. 产品准入审核',
              children: (
                <ProTable<CatalogItem>
                  columns={auditColumns}
                  actionRef={actionRefAudit}
                  scroll={{ x: 1000 }}
                  request={async (params) => {
                    try {
                      const res = await catalogApi.search({ ...params, status: '待审核', catalogType: 'PRODUCT' });
                      return { data: res.data, success: true };
                    } catch (e) {
                      return { data: [], success: false };
                    }
                  }}
                  rowKey="id"
                  headerTitle="待审核申请列表"
                />
              ),
            },
            {
              key: 'register',
              label: '2. 产品标识登记',
              children: (
                <ProTable<CatalogItem>
                  columns={registerColumns}
                  actionRef={actionRefRegister}
                  scroll={{ x: 1300 }}
                  request={async (params) => {
                    try {
                      const res = await catalogApi.search({ ...params, catalogType: 'PRODUCT' });
                      const filtered = (res.data || []).filter(i => 
                        ['审核通过', '已登记', '已发布', 'AUDITED', 'REGISTERED', 'ACTIVE'].includes(i.status)
                      );
                      return { data: filtered, success: true };
                    } catch (e) {
                      return { data: [], success: false };
                    }
                  }}
                  rowKey="id"
                  headerTitle="产品标识维护列表"
                />
              ),
            },
          ]}
        />
      <ProductDetailModal
        visible={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        product={selectedCatalog}
      />
    </PageContainer>
  );
};

export default CatalogManagement;
