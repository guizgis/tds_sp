import React from 'react';
import { Divider, Typography } from 'antd';
import { 
  ProFormSelect, 
  ProFormList, 
  ProFormGroup, 
  ProFormText 
} from '@ant-design/pro-components';

const ACTION_OPTIONS = [
  { label: '读取 (Read)', value: 'read' },
  { label: '下载 (Download)', value: 'download' },
  { label: '脱敏 (Desensitize)', value: 'desensitize' },
  { label: '匿名化 (Anonymize)', value: 'anonymize' },
  { label: '转换 (Transform)', value: 'transform' },
  { label: '计算 (Compute)', value: 'compute' },
  { label: '联合开发 (JointDevelop)', value: 'jointDevelop' },
  { label: '分发 (Distribute)', value: 'distribute' },
  { label: '删除 (Delete)', value: 'delete' },
];

const CONSTRAINT_NAMES = [
  { label: '使用次数 (Count)', value: 'count' },
  { label: '时间窗口 (TimeWindow)', value: 'timeWindow' },
  { label: '限制地域 (Region)', value: 'region' },
  { label: '网络地址 (NetworkAddress)', value: 'networkAddress' },
  { label: '执行环境 (ExecutionEnv)', value: 'executionEnv' },
];

const OPERATORS = [
  { label: '等于 (eq)', value: '01' },
  { label: '大于 (gt)', value: '02' },
  { label: '小于或等于 (lteq)', value: '11' },
  { label: '属于实例 (isA)', value: '05' },
];

const PolicyForm: React.FC = () => {
  return (
    <>
      <Typography.Title level={5}>操作行为设定</Typography.Title>
      <ProFormSelect
        name="actions"
        label="允许的操作列表"
        mode="multiple"
        placeholder="请选择该合约允许的操作行为"
        options={ACTION_OPTIONS}
        rules={[{ required: true }]}
      />

      <Divider />
      <Typography.Title level={5}>约束条件设定</Typography.Title>
      <ProFormList
        name="constraints"
        creatorButtonProps={{
          creatorButtonText: '添加约束条件',
        }}
      >
        <ProFormGroup>
          <ProFormSelect
            name="constraintName"
            label="约束项"
            width="sm"
            options={CONSTRAINT_NAMES}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="constraintOperator"
            label="运算符"
            width="xs"
            options={OPERATORS}
            rules={[{ required: true }]}
          />
          <ProFormText
            name="constraintValue"
            label="限制值"
            width="sm"
            placeholder="输入限制值"
            rules={[{ required: true }]}
          />
        </ProFormGroup>
      </ProFormList>
    </>
  );
};

export default PolicyForm;