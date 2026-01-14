import React, { useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ProTable, PageContainer, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { policyTemplateApi } from '../api/contract';
import type { PolicyTemplate } from '../api/contract';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import PolicyForm from '../components/PolicyForm';

const PolicyTemplateManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<PolicyTemplate | undefined>(undefined);
  const [form] = ProForm.useForm();

  const handleEdit = (record: PolicyTemplate) => {
    setCurrentRow(record);
    try {
      const config = JSON.parse(record.policyConfig);
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        ...config // Spread policyType, actions, constraints
      });
    } catch (e) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        policyType: 'permission',
        actions: [],
        constraints: []
      });
    }
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setCurrentRow(undefined);
    form.resetFields();
    // Default values
    form.setFieldsValue({
      policyType: 'permission',
      actions: [],
      constraints: []
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await policyTemplateApi.delete(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleFinish = async (values: any) => {
    try {
      // Serialize form values back to JSON string for backend
      const policyConfig = JSON.stringify({
        policyType: values.policyType,
        actions: values.actions,
        constraints: values.constraints
      });

      const payload = {
        name: values.name,
        description: values.description,
        policyConfig: policyConfig
      };

      if (currentRow) {
        await policyTemplateApi.update(currentRow.id, payload);
        message.success('更新成功');
      } else {
        await policyTemplateApi.create(payload);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ProColumns<PolicyTemplate>[] = [
    { title: '模板名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime', search: false },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
        <a key="delete" style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>删除</a>,
      ],
    },
  ];

  return (
    <PageContainer header={{ title: '策略模板管理', subTitle: '管理可复用的数据使用控制策略模板' }}>
      <ProTable<PolicyTemplate>
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const res = await policyTemplateApi.list();
          return { data: res.data, success: true };
        }}
        rowKey="id"
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleAdd}>新建模板</Button>,
        ]}
      />
      <Modal
        title={currentRow ? '编辑模板' : '新建模板'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        destroyOnClose
      >
        <ProForm 
          form={form} 
          layout="vertical" 
          onFinish={handleFinish}
          submitter={false}
        >
          <ProFormText 
            name="name" 
            label="模板名称" 
            rules={[{ required: true, message: '请输入模板名称' }]} 
            placeholder="例如：默认数据沙箱访问策略" 
          />
          <ProFormTextArea 
            name="description" 
            label="模板描述" 
            rules={[{ required: true, message: '请输入模板描述' }]} 
            placeholder="简要描述该策略的适用场景和约束条件" 
            fieldProps={{ rows: 3 }} 
          />
          
          <PolicyForm />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default PolicyTemplateManagement;