import React, { useRef } from 'react';
import { message, Tag, Space, Button } from 'antd';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { catalogApi } from '../api/catalog';
import type { UsageApplication } from '../api/catalog';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const UsageApplications: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const handleAudit = async (id: string, approved: boolean) => {
    try {
      await catalogApi.auditApplication(id, approved);
      message.success(approved ? '已准予使用' : '已拒绝申请');
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ProColumns<UsageApplication>[] = [
    { title: '申请单号', dataIndex: 'id', copyable: true, width: 120 },
    { title: '申请产品', dataIndex: 'catalogName' },
    { title: '申请方', dataIndex: 'applicantId', ellipsis: true },
    { title: '申请原因', dataIndex: 'reason', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        'PENDING': { text: '审核中', status: 'Processing' },
        'APPROVED': { text: '已授权', status: 'Success' },
        'REJECTED': { text: '已驳回', status: 'Error' },
      },
    },
    { title: '提交时间', dataIndex: 'submitTime', valueType: 'dateTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => record.status === 'PENDING' ? [
        <a key="pass" style={{color: 'green'}} onClick={() => handleAudit(record.id, true)}>同意</a>,
        <a key="reject" style={{color: 'red'}} onClick={() => handleAudit(record.id, false)}>拒绝</a>,
      ] : [<a key="view">查看记录</a>],
    },
  ];

  return (
    <PageContainer header={{ title: '使用申请', subTitle: '管理数据产品的使用申请审批及授权记录' }}>
      <ProTable<UsageApplication>
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const res = await catalogApi.listApplications();
          return { data: res.data, success: true };
        }}
        rowKey="id"
        headerTitle="申请列表"
      />
    </PageContainer>
  );
};

export default UsageApplications;
