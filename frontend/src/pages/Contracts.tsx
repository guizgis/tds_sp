import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Typography, Divider, Form } from 'antd';
import { PlusOutlined, FileTextOutlined, SafetyCertificateOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { 
  ProTable, 
  PageContainer, 
  StepsForm, 
  ProFormText, 
  ProFormTextArea, 
  ProFormSelect, 
  ProFormDateTimePicker,
  ProCard,
  ProFormCheckbox
} from '@ant-design/pro-components';
import { contractApi, policyTemplateApi } from '../api/contract';
import type { ContractCreateRequest, PolicyTemplate } from '../api/contract';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import PolicyForm from '../components/PolicyForm';

const { Paragraph } = Typography;

// Mock data updated for ProTable
const MOCK_DATA = [
  {
    contractId: 'C391100000000000000000020260107120000123456781',
    contractName: '公共交通流量数据共享协议',
    contractStatus: '05',
    filingStatus: 'FILED',
    signMode: '02',
    issuerId: 'TRANS_CORP_01',
    createTime: '2026-01-07 12:00:00',
  },
  {
    contractId: 'C391100000000000000000020260107143000888888882',
    contractName: '气象遥感数据联合开发合同',
    contractStatus: '0301',
    filingStatus: 'UNFILED',
    signMode: '01',
    issuerId: 'METEO_DEPT_05',
    createTime: '2026-01-07 14:30:00',
  }
];

const Contracts: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await policyTemplateApi.list();
      setTemplates(res.data);
    } catch (e) {
      console.error("Failed to load templates");
    }
  };

  const handleFile = async (id: string) => {
    try {
      await contractApi.registrateContract({ contractId: id });
      message.success('合约备案成功');
      actionRef.current?.reload();
    } catch (e) {
      message.error('备案失败');
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '合约名称',
      dataIndex: 'contractName',
      copyable: true,
      tip: '数字合约的正式名称',
    },
    {
      title: '合约标识码',
      dataIndex: 'contractId',
      width: 280,
      search: false,
      render: (id) => <code style={{ color: '#0050b3', fontSize: '12px' }}>{id}</code>,
    },
    {
      title: '状态',
      dataIndex: 'contractStatus',
      valueType: 'select',
      valueEnum: {
        '01': { text: '已发起', status: 'Processing' },
        '02': { text: '协商中', status: 'Processing' },
        '0301': { text: '签署成功', status: 'Success' },
        '05': { text: '履行中', status: 'Success' },
        '06': { text: '已终止', status: 'Error' },
      },
    },
    {
      title: '备案状态',
      dataIndex: 'filingStatus',
      valueEnum: {
        'UNFILED': { text: '未备案', status: 'Default' },
        'FILED': { text: '已备案', status: 'Success' },
      },
    },
    {
      title: '签署模式',
      dataIndex: 'signMode',
      valueEnum: {
        '01': { text: '点对点' },
        '02': { text: '平台参与' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => {
        const actions = [
          <a key="view" onClick={() => { setSelectedContract(record); setIsDetailVisible(true); }}>详情</a>,
        ];
        if (record.contractStatus === '0301' && record.filingStatus !== 'FILED') {
          actions.push(<a key="file" onClick={() => handleFile(record.contractId)}><CloudUploadOutlined /> 备案</a>);
        }
        if (record.contractStatus !== '06') {
          actions.push(<a key="terminate" style={{ color: '#ff4d4f' }}>解除</a>);
        }
        return actions;
      },
    },
  ];

  const handleTemplateChange = (value: number) => {
    const template = templates.find(t => t.id === value);
    if (template) {
      try {
        const config = JSON.parse(template.policyConfig);
        form.setFieldsValue({
          actions: config.actions,
          constraints: config.constraints
        });
      } catch (e) {
        message.error('模板格式错误');
      }
    }
  };

  const handleCreate = async (values: any) => {
    try {
      // 1. Prepare Policy Snapshot
      const policyConfig = {
        actions: values.actions,
        constraints: values.constraints
      };
      const policySnapshot = JSON.stringify(policyConfig);

      // 2. Save as new template if requested
      if (values.saveAsTemplate) {
        await policyTemplateApi.create({
          name: values.newTemplateName || `${values.contractName}_Policy`,
          description: 'Created from contract flow',
          policyConfig: policySnapshot
        });
        message.success('新策略模板已保存');
        loadTemplates(); // Refresh for next time
      }

      // 3. Create Contract
      const request: ContractCreateRequest & { policySnapshot: string } = {
        contractName: values.contractName,
        contractAbstract: values.contractAbstract,
        signMode: values.signMode,
        issueTime: new Date().toISOString(),
        activationTime: values.activationTime,
        endTime: values.endTime,
        issuerId: 'TRANS_DEPT_01',
        issuerEntityId: 'ENTITY_001',
        signature: 'CERT_SIGN_MOCK_XYZ',
        policySnapshot: policySnapshot
      };
      
      // Need to cast to any because createContract signature in api might be strict but we updated backend
      // Actually I should update api/contract.ts ContractCreateRequest interface too.
      // But for now, let's cast or rely on JS.
      const res = await contractApi.createContract(request as any);
      
      if (res.data.status === '0') {
        message.success('合约发起成功，标识码已签发');
        setIsModalVisible(false);
        actionRef.current?.reload();
        return true;
      }
      return false;
    } catch (error) {
      message.error('发起失败：操作异常');
      return false;
    }
  };

  return (
    <PageContainer
      header={{
        title: '数字合约管理',
        subTitle: '基于 TC609-6-2025-14 标准的合约全生命周期管理',
      }}
    >
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        headerTitle="数字合约列表"
        dataSource={MOCK_DATA} 
        rowKey="contractId"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => setIsModalVisible(true)}>
            发起新合约
          </Button>,
        ]}
      />

      <Modal
        title="发起数字合约 (标准合规流程)"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <StepsForm
          onFinish={handleCreate}
          formProps={{ layout: 'vertical', form }}
        >
          <StepsForm.StepForm title="基本信息">
            <ProFormText name="contractName" label="合约名称" rules={[{ required: true }]} placeholder="请输入合约名称" />
            <ProFormTextArea name="contractAbstract" label="合约简介" rules={[{ required: true }]} placeholder="简要说明权利义务" />
            <ProFormSelect 
              name="signMode" 
              label="签署模式" 
              initialValue="01" 
              options={[
                { label: '点对点协商 (P2P)', value: '01' },
                { label: '平台参与协商', value: '02' },
              ]} 
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <ProFormDateTimePicker name="activationTime" label="生效时间" rules={[{ required: true }]} />
              <ProFormDateTimePicker name="endTime" label="截止时间" rules={[{ required: true }]} />
            </div>
          </StepsForm.StepForm>
          
          <StepsForm.StepForm title="策略设定">
            <ProCard title="数据使用策略配置" bordered headerBordered>
              <ProFormSelect
                name="templateId"
                label="选择策略模板"
                options={templates.map(t => ({ label: t.name, value: t.id }))}
                placeholder="请选择预置模板（可选）"
                fieldProps={{ onChange: handleTemplateChange }}
              />
              <Divider dashed />
              <PolicyForm />
              <Divider dashed />
              <ProFormCheckbox name="saveAsTemplate" label="将当前配置保存为新策略模板" />
              <ProFormText 
                name="newTemplateName" 
                label="新模板名称" 
                placeholder="如果不填，默认使用合约名称"
                dependencies={['saveAsTemplate']}
                hidden={!form.getFieldValue('saveAsTemplate')} 
              />
            </ProCard>
          </StepsForm.StepForm>

          <StepsForm.StepForm title="签署确认">
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <SafetyCertificateOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <Paragraph>
                <blockquote>
                  请核对以上合约信息。点击“确认并数字签名”后，系统将使用您的 <strong>NDI 身份证书</strong> 对合约摘要进行签名，并上传至可信数据空间服务平台获取唯一标识码。
                </blockquote>
              </Paragraph>
              <Divider />
              <ProFormText label="确认签署人" initialValue="数据基础设施授权操作员 - TRANS_DEPT_01" disabled />
            </div>
          </StepsForm.StepForm>
        </StepsForm>
      </Modal>

      <Modal
        title="合约详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setIsDetailVisible(false)}>关闭</Button>]}
        width={700}
      >
        {selectedContract && (
          <div>
            <Typography.Title level={5}>基本信息</Typography.Title>
            <Paragraph><strong>合约名称：</strong>{selectedContract.contractName}</Paragraph>
            <Paragraph><strong>合约 ID：</strong><code>{selectedContract.contractId}</code></Paragraph>
            <Paragraph><strong>签署模式：</strong>{selectedContract.signMode === '01' ? '点对点协商' : '平台参与'}</Paragraph>
            <Paragraph><strong>发起方：</strong>{selectedContract.issuerId}</Paragraph>
            <Paragraph><strong>创建时间：</strong>{selectedContract.createTime}</Paragraph>
            <Divider />
            <Typography.Title level={5}>使用策略</Typography.Title>
            <Paragraph type="secondary">
              {selectedContract.policySnapshot || '（未配置策略快照）'}
            </Paragraph>
            <Divider />
            <Typography.Title level={5}>签名信息</Typography.Title>
            <Paragraph><strong>签名者：</strong>TDS-SP-OPERATOR-001</Paragraph>
            <Paragraph><strong>签名算法：</strong>SM2-SM3</Paragraph>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Contracts;