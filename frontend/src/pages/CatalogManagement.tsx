import React, { useRef, useState } from 'react';
import { message, Tag, Button, Tabs, Space, Card, Col, Row, Statistic, Typography } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { AuditOutlined, FileProtectOutlined, CloudServerOutlined } from '@ant-design/icons';

const { Text } = Typography;

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
    cardBordered: false, 
    options: { density: true, fullScreen: true, setting: true },
    search: { 
      filterType: 'query', 
      span: 6, 
      labelWidth: 'auto',
      className: 'glass-card',
      style: { padding: '24px', borderRadius: 12, marginBottom: 24, background: 'rgba(255,255,255,0.4)' }
    } as const,
    scroll: { x: 1300 },
    pagination: { pageSize: 10 },
  };

  const columns: ProColumns<CatalogItem>[] = [
    { title: '产品名称', dataIndex: 'name', copyable: true, ellipsis: true, width: 180, fixed: 'left' },
    { 
      title: '主题分类', 
      dataIndex: 'topicCategory',
      width: 120,
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
        const colors: any = { '001': 'green', '002': 'cyan', '003': 'orange', '004': 'red' };
        return <Tag color={colors[val as string] || 'blue'} bordered={false}>{`L${val || '2'}`}</Tag>;
      }
    },
    { 
      title: '提供方', 
      dataIndex: 'providerName', 
      ellipsis: true,
      width: 180,
      render: (_, record) => <Text type="secondary">{record.providerName || record.providerId}</Text>
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
        <Button key="view" type="text" size="small" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</Button>,
        <Button key="pass" type="link" size="small" style={{ color: '#52c41a' }} onClick={() => handleAction(record.id, true, actionRefAudit)}>通过</Button>,
        <Button key="reject" type="link" danger size="small" onClick={() => handleAction(record.id, false, actionRefAudit)}>驳回</Button>,
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
        <code style={{ background: '#f0f7ff', color: '#0050b3', padding: '2px 6px', borderRadius: 4, border: '1px solid #adc6ff' }}>{id}</code> : 
        <Tag color="default" bordered={false}>未分配</Tag>
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
          <Button key="view" type="text" size="small" onClick={() => { setSelectedCatalog(record); setIsDetailVisible(true); }}>详情</Button>
        ];
        
        if (record.status === '审核通过') {
          actions.push(<Button key="reg" type="primary" size="small" style={{ borderRadius: 6 }} onClick={() => handleAction(record.id, true, actionRefRegister)}>向节点登记</Button>);
        } else if (record.status === '已登记' || record.status === '已发布') {
          actions.push(<Button key="update" type="link" size="small">更新</Button>);
          actions.push(<Button key="revoke" type="text" danger size="small">撤销</Button>);
          if (record.status === '已登记') {
            actions.push(<Button key="publish" type="primary" ghost size="small" style={{ borderRadius: 6 }} onClick={() => handleAction(record.id, true, actionRefRegister)}>发布</Button>);
          }
        }
        return actions;
      },
    },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card 
      bordered={false} 
      className="glass-card"
      bodyStyle={{ padding: '24px' }} 
      style={{ height: '100%', borderRadius: 12 }}
    >
      <Statistic 
        title={<span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>{title}</span>}
        value={value}
        valueStyle={{ fontWeight: 700, color: '#1e293b' }}
        prefix={<span style={{ 
          marginRight: 16, 
          padding: '10px', 
          background: `${color}15`, 
          borderRadius: 10, 
          color: color,
          display: 'inline-flex',
          boxShadow: `0 4px 10px ${color}20`
        }}>{icon}</span>}
      />
    </Card>
  );

  return (
    <PageContainer
      header={{
        title: '产品治理工作台',
        subTitle: '全生命周期数字产品审核与 NDI 标识登记',
        ghost: true,
      }}
      content={
        <Row gutter={20} style={{ marginBottom: 24 }}>
          <Col span={8}><StatCard title="待审核申请" value={12} icon={<AuditOutlined style={{fontSize: 20}}/>} color="#f59e0b" /></Col>
          <Col span={8}><StatCard title="今日已登记" value={5} icon={<FileProtectOutlined style={{fontSize: 20}}/>} color="#10b981" /></Col>
          <Col span={8}><StatCard title="累计发布产品" value={128} icon={<CloudServerOutlined style={{fontSize: 20}}/>} color="#3b82f6" /></Col>
        </Row>
      }
    >
      <Tabs
        type="card"
        tabBarStyle={{ marginBottom: 24, borderBottom: 'none' }}
        className="custom-tabs"
        items={[
          {
            key: 'audit',
            label: `准入审核`,
            children: (
              <div className="glass-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
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
                  headerTitle={<span style={{ fontWeight: 600, fontSize: 16, color: '#334155' }}>待处理申请</span>}
                />
              </div>
            ),
          },
          {
            key: 'register',
            label: '标识登记',
            children: (
              <div className="glass-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
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
                  headerTitle={<span style={{ fontWeight: 600, fontSize: 16, color: '#334155' }}>产品标识库</span>}
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
