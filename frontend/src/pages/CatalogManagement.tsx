import React, { useRef, useState } from 'react';
import { message, Tag, Button, Tabs, Space, Card, Col, Row, Statistic } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { AuditOutlined, FileProtectOutlined, CloudServerOutlined } from '@ant-design/icons';

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

  const commonTableProps = {
    cardBordered: false, // 移除边框，更现代
    options: { density: true, fullScreen: true, setting: true },
    search: { 
      filterType: 'query', 
      span: 6, 
      labelWidth: 'auto',
      style: { marginBottom: 24, padding: '24px', background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }
    } as const,
    scroll: { x: 1300 },
    pagination: { pageSize: 10 },
  };

  // ... (columns definitions remain similar, but refine Tag colors)
  const columns: ProColumns<CatalogItem>[] = [
    { title: '产品名称', dataIndex: 'name', copyable: true, ellipsis: true, width: 180, fixed: 'left', formItemProps: { rules: [{ required: true }] } },
    { 
      title: '主题分类', 
      dataIndex: 'topicCategory',
      width: 120,
      valueEnum: {
        'A0000': { text: '综合政务', status: 'Default' },
        'B0000': { text: '经济管理', status: 'Processing' },
        'C0000': { text: '科技教育', status: 'Success' },
        'D0000': { text: '文化卫生', status: 'Warning' },
      }
    },
    // ... other columns
    { 
      title: '数据来源', 
      dataIndex: 'sourceType',
      width: 120,
      valueEnum: {
        '001': { text: '原始取得' },
        '002': { text: '收集取得' },
        '003': { text: '交易取得' },
      }
    },
    {
      title: '安全级别',
      dataIndex: 'securityLevel',
      width: 100,
      render: (val) => {
        const colors = { '001': 'green', '002': 'cyan', '003': 'orange', '004': 'red' };
        return <Tag color={colors[val as keyof typeof colors] || 'blue'}>{`L${val || '2'}`}</Tag>;
      }
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
        <a key="view" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</a>,
        <a key="pass" style={{ color: '#52c41a', fontWeight: 500 }} onClick={() => handleAction(record.id, true, actionRefAudit)}>通过</a>,
        <a key="reject" style={{ color: '#ff4d4f' }} onClick={() => handleAction(record.id, false, actionRefAudit)}>驳回</a>,
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
      render: (id, record) => (record.status === '已登记' || record.status === '已发布') ? 
        <Tag style={{ fontFamily: 'monospace', background: '#f6ffed', color: '#389e0d', border: '1px solid #b7eb8f' }}>{id}</Tag> : 
        <Tag color="default">未分配</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 100,
      valueEnum: {
        '审核通过': { text: '待登记', status: 'Warning' },
        '已登记': { text: '已登记', status: 'Success' },
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
          <a key="view" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</a>,
        ];
        
        if (record.status === '审核通过') {
          actions.push(<Button key="reg" type="primary" size="small" style={{ borderRadius: 4 }} onClick={() => handleAction(record.id, true, actionRefRegister)}>向节点登记</Button>);
        } else if (record.status === '已登记' || record.status === '已发布') {
          actions.push(<a key="update">更新</a>);
          actions.push(<a key="revoke" style={{ color: '#ff4d4f' }}>撤销</a>);
          if (record.status === '已登记') {
            actions.push(<Button key="publish" type="dashed" size="small" style={{ borderColor: '#13c2c2', color: '#13c2c2' }} onClick={() => handleAction(record.id, true, actionRefRegister)}>发布</Button>);
          }
        }
        return actions;
      },
    },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card bordered={false} bodyStyle={{ padding: '20px 24px' }} style={{ height: '100%', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', borderRadius: 8 }}>
      <Statistic 
        title={<span style={{ color: '#8c8c8c', fontSize: 14 }}>{title}</span>}
        value={value}
        valueStyle={{ fontWeight: 600 }}
        prefix={<span style={{ marginRight: 12, padding: 8, background: `${color}15`, borderRadius: 6, color: color }}>{icon}</span>}
      />
    </Card>
  );

  return (
    <PageContainer
      header={{
        title: '产品审核与登记',
        subTitle: '独立管理产品的准入审核与 NDI 标识登记流程',
        ghost: true,
      }}
      content={
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}><StatCard title="待审核申请" value={12} icon={<AuditOutlined />} color="#faad14" /></Col>
          <Col span={8}><StatCard title="今日已登记" value={5} icon={<FileProtectOutlined />} color="#52c41a" /></Col>
          <Col span={8}><StatCard title="累计发布产品" value={128} icon={<CloudServerOutlined />} color="#1890ff" /></Col>
        </Row>
      }
    >
      <Tabs
        type="card"
        tabBarStyle={{ marginBottom: 24, borderBottom: 'none' }}
        items={[
          {
            key: 'audit',
            label: `产品准入审核`,
            children: (
              <div style={{ background: '#fff', padding: '0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
                <ProTable<CatalogItem>
                  {...commonTableProps}
                  columns={auditColumns}
                  actionRef={actionRefAudit}
                  request={async (params) => {
                    try {
                      const res = await catalogApi.search({ ...params, status: '待审核', catalogType: 'PRODUCT' });
                      return { data: res.data, success: true };
                    } catch (e) {
                      return { data: [], success: false };
                    }
                  }}
                  rowKey="id"
                  headerTitle={<span style={{ fontWeight: 600, fontSize: 16 }}>待审核列表</span>}
                />
              </div>
            ),
          },
          {
            key: 'register',
            label: '产品标识登记',
            children: (
              <div style={{ background: '#fff', padding: '0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
                <ProTable<CatalogItem>
                  {...commonTableProps}
                  columns={registerColumns}
                  actionRef={actionRefRegister}
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
                  headerTitle={<span style={{ fontWeight: 600, fontSize: 16 }}>标识维护列表</span>}
                />
              </div>
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