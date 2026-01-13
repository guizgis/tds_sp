import React from 'react';
import { Modal, Descriptions, Tag, Button, Tabs, Badge, Typography } from 'antd';
import type { CatalogItem } from '../api/catalog';

const { Text } = Typography;

interface ProductDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  product: CatalogItem | null;
  footer?: React.ReactNode[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ visible, onCancel, product, footer }) => {
  if (!product) return null;

  const metadata = product.fullDataJson ? JSON.parse(product.fullDataJson) : {};
  const isRegistered = product.status === '已登记' || product.status === 'REGISTERED' || product.status === '已发布' || product.status === 'ACTIVE';

  return (
    <Modal
      title={<span>数据产品详情 <Tag color="blue" style={{marginLeft: 8}}>{product.status}</Tag></span>}
      open={visible}
      onCancel={onCancel}
      footer={footer || [<Button key="close" onClick={onCancel}>关闭</Button>]}
      width={1000}
    >
      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: '1. 基础信息',
            children: (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="产品名称" span={2}>{product.name}</Descriptions.Item>
                <Descriptions.Item label="产品标识" span={2}>
                  {(product.status === '已登记' || product.status === '已发布') ? 
                    <Text copyable className="font-mono">{product.id}</Text> : 
                    <Tag color="orange">等待登记后分配</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="提供方名称">{product.providerName || '未知机构'}</Descriptions.Item>
                <Descriptions.Item label="提供方标识">{product.providerId}</Descriptions.Item>
                <Descriptions.Item label="产品描述" span={2}>{product.description}</Descriptions.Item>
                <Descriptions.Item label="提交时间">{new Date(product.createTime).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="版本号">{product.version || '1.0'}</Descriptions.Item>
              </Descriptions>
            )
          },
          {
            key: 'classification',
            label: '2. 分类分级',
            children: (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="主题分类">
                   <Tag color="cyan">{metadata.topicCategory || '行业资源'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="安全等级">
                   <Badge status={metadata.securityLevel === '003' ? 'warning' : 'processing'} text={`L${metadata.securityLevel || '2'}`} />
                </Descriptions.Item>
                <Descriptions.Item label="数据质量">
                   {metadata.qualityLevel === '001' ? 'A级 (优)' : 'B级 (良)'}
                </Descriptions.Item>
                <Descriptions.Item label="更新频率">
                   {metadata.updateFrequency || '每日'}
                </Descriptions.Item>
              </Descriptions>
            )
          },
          {
            key: 'scenario',
            label: '3. 适用场景',
            children: (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="应用场景分类">
                   <Tag color="blue">{metadata.applicationCategory || '政府治理'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="行业分类">
                   {metadata.industryCategory || '电信广播'}
                </Descriptions.Item>
              </Descriptions>
            )
          },
          {
            key: 'policy',
            label: '4. 使用策略',
            children: (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="数据来源">
                   <Tag color="orange">{metadata.sourceType === '001' ? '原始取得' : '收集取得'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="交付形式">
                   <Tag color="purple">{metadata.deliveryMode === '002' ? 'API产品' : '数据集'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="服务类型">
                   {metadata.serviceType || 'API服务'}
                </Descriptions.Item>
                <Descriptions.Item label="使用政策描述">
                   {metadata.usagePolicy || '遵循可信数据空间通用访问策略'}
                </Descriptions.Item>
              </Descriptions>
            )
          }
        ]}
      />
    </Modal>
  );
};
