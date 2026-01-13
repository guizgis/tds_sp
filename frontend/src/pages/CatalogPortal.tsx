import React, { useState } from 'react';
import { message, Card, Tag, Button, Space, Radio, Typography, Row, Col, Badge, Tabs } from 'antd';
import { ProList, PageContainer } from '@ant-design/pro-components';
import { 
  AppstoreOutlined, 
  BarsOutlined, 
  ShoppingCartOutlined, 
  GlobalOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { catalogApi } from '../api/catalog';
import type { CatalogItem } from '../api/catalog';
import { ProductDetailModal } from '../components/ProductDetailModal';

const { Paragraph, Text, Title } = Typography;

const CatalogPortal: React.FC = () => {
  const [viewType, setViewType] = useState<'card' | 'list'>('card');
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [origin, setOrigin] = useState<string>('LOCAL');

  const handleApply = async (product: CatalogItem) => {
    try {
      await catalogApi.submitApplication(product.id, {
        applicantId: 'did:tds:mock:visitor_01',
        reason: '业务系统集成测试，获取实时数据支撑治理决策'
      });
      message.success(`已发起对产品 [${product.name}] 的使用申请，请前往“使用申请”页面查看`);
    } catch (e) {
      message.error('申请提交失败');
    }
  };

  const simulateSubmit = async () => {
    try {
      await catalogApi.register({
        name: '测试治理流程产品_' + Math.random().toString(36).substring(7),
        catalogType: 'PRODUCT',
        description: '这是一个用于测试审核、登记、发布全流程的模拟产品',
        topicCategory: 'B0000',
        industryCategory: 'G54',
        organizationCategory: 'ORG_TEST',
        applicationCategory: 'S0000',
        sourceType: '001',
        deliveryMode: '002',
        updateFrequency: '001',
        qualityLevel: '001',
        securityLevel: '002',
        serviceType: '002',
        providerId: 'did:tds:mock:weather_org'
      });
      message.success('模拟产品提交成功，请前往“审核登记”页面处理');
    } catch (e) {
      message.error('提交失败');
    }
  };

  const renderProductCard = (record: CatalogItem) => {
    return (
      <Card
        hoverable
        className="product-card"
        style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: 16 }}
        bodyStyle={{ padding: '16px' }}
        actions={[
          <Button key="detail" type="link" onClick={() => { setSelectedProduct(record); setDetailVisible(true); }}>
            查看详情
          </Button>,
          <Button 
            key="apply" 
            type="primary" 
            size="small" 
            icon={<ShoppingCartOutlined />} 
            style={{ borderRadius: 4 }}
            onClick={() => handleApply(record)}
          >
            申请使用
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 12 }}>
          <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={5} style={{ margin: 0, fontSize: 16 }} ellipsis={{ rows: 1 }}>
              {record.name}
            </Title>
            <Tag color={origin === 'LOCAL' ? 'green' : 'blue'} style={{ margin: 0 }}>
              {origin === 'LOCAL' ? '本空间' : '全网'}
            </Tag>
          </Space>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <GlobalOutlined style={{ marginRight: 4 }} />
              {record.providerName || record.providerId}
            </Text>
          </div>
        </div>

        <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: 13, height: 40, marginBottom: 16 }}>
          {record.description}
        </Paragraph>

        <div style={{ background: '#fafafa', padding: '12px', borderRadius: 6 }}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>主题分类</Text>
                <Text strong style={{ fontSize: 12 }}>{record.topicCategory === 'B0000' ? '经济管理' : (record.topicCategory === 'A0000' ? '综合政务' : '科技教育')}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>安全级别</Text>
                <Badge status={record.securityLevel === '003' ? 'warning' : 'processing'} text={`L${record.securityLevel || '2'}`} />
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>交付形式</Text>
                <Space size={4}>
                  <DatabaseOutlined style={{ fontSize: 12, color: '#1890ff' }} />
                  <Text style={{ fontSize: 12 }}>{record.deliveryMode === '002' ? 'API产品' : '数据集'}</Text>
                </Space>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>更新频率</Text>
                <Text style={{ fontSize: 12 }}>{record.updateFrequency || '每日'}</Text>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>
    );
  };

  return (
    <PageContainer 
      header={{ 
        title: '产品目录', 
        subTitle: '浏览本空间及全网可信数据空间发布的优质数据产品',
        extra: [
          <Button key="add" type="primary" onClick={simulateSubmit}>模拟提交新产品</Button>,
          <Radio.Group key="view" value={viewType} onChange={(e) => setViewType(e.target.value)}>
            <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
            <Radio.Button value="list"><BarsOutlined /></Radio.Button>
          </Radio.Group>
        ],
        footer: (
          <Tabs 
            activeKey={origin} 
            onChange={setOrigin}
            items={[
              { key: 'LOCAL', label: '本空间产品' },
              { key: 'NETWORK', label: '全网开放资源' },
            ]} 
          />
        )
      }}
    >
      <ProList<CatalogItem>
        rowKey="id"
        headerTitle={false}
        search={{
          filterType: 'query',
          defaultCollapsed: false,
          span: 6,
          labelWidth: 80,
        }}
        grid={viewType === 'card' ? { gutter: 16, column: 3 } : undefined}
        request={async (params) => {
          const res = await catalogApi.search({ 
            ...params, 
            keyword: params.name, // 关键修复：映射参数名
            status: '已发布', 
            spaceId: origin === 'LOCAL' ? 'THIS_SPACE' : 'EXTERNAL' 
          });
          return { data: res.data, success: true };
        }}
        renderItem={(item) => viewType === 'card' ? renderProductCard(item) : undefined}
        metas={{
          title: { dataIndex: 'name', title: '产品名称' },
          subTitle: {
            render: (_, record) => (
              <Space size={0}>
                <Tag color="blue">{record.providerName || record.providerId}</Tag>
                <Tag color="orange">{record.version}</Tag>
                <Badge status={record.securityLevel === '003' ? 'warning' : 'processing'} text={`L${record.securityLevel || '2'}`} />
              </Space>
            ),
            search: false
          },
          topicCategory: {
            title: '主题分类',
            dataIndex: 'topicCategory',
            valueEnum: {
              'A0000': { text: '综合政务' },
              'B0000': { text: '经济管理' },
              'C0000': { text: '科技教育' },
            }
          },
          securityLevel: {
            title: '安全级别',
            dataIndex: 'securityLevel',
            valueEnum: {
              '001': { text: 'L1' },
              '002': { text: 'L2' },
              '003': { text: 'L3' },
            }
          },
          actions: {
            render: (_, record) => [
              <Button key="detail" type="link" onClick={() => { setSelectedProduct(record); setDetailVisible(true); }}>详情</Button>,
              <Button key="apply" type="primary" size="small" icon={<ShoppingCartOutlined />} onClick={() => handleApply(record)}>申请使用</Button>,
            ],
            search: false
          },
        }}
      />

      <ProductDetailModal 
        visible={detailVisible} 
        onCancel={() => setDetailVisible(false)} 
        product={selectedProduct}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button key="apply" type="primary" onClick={() => { setDetailVisible(false); handleApply(selectedProduct!); }}>申请使用</Button>
        ]}
      />
    </PageContainer>
  );
};

export default CatalogPortal;