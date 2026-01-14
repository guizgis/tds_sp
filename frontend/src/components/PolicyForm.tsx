import React from 'react';
import { Divider, Typography } from 'antd';
import { 
  ProFormSelect, 
  ProFormList, 
  ProFormGroup, 
  ProFormText,
  ProFormRadio
} from '@ant-design/pro-components';

// 标准 6.2.2.1 策略类型
const POLICY_TYPES = [
  { label: '允许策略 (Permission)', value: 'permission' },
  { label: '禁止策略 (Prohibition)', value: 'prohibition' },
  { label: '义务策略 (Obligation)', value: 'obligation' },
];

// 附录 C.5 操作行为字典
const ACTION_OPTIONS = [
  { label: '访问 (access)', value: 'access' },
  { label: '读取 (read)', value: 'read' },
  { label: '下载 (download)', value: 'download' },
  { label: '复制 (reproduce)', value: 'reproduce' },
  { label: '存储 (storage)', value: 'storage' },
  { label: '加工 (process)', value: 'process' },
  { label: '计算 (compute)', value: 'compute' },
  { label: '联合开发 (jointDevelop)', value: 'jointDevelop' },
  { label: '分发 (distribute)', value: 'distribute' },
  { label: '授权使用 (grantUse)', value: 'grantUse' },
  { label: '策略传递 (policyTransmit)', value: 'policyTransmit' },
  { label: '交付 (delivery)', value: 'delivery' },
  { label: '交易 (sell)', value: 'sell' },
  { label: '脱敏 (desensitize)', value: 'desensitize' },
  { label: '匿名化 (anonymize)', value: 'anonymize' },
  { label: '转换 (transform)', value: 'transform' },
  { label: '删除 (delete)', value: 'delete' },
  { label: '行为记录发送 (logRecordSend)', value: 'logRecordSend' },
  { label: '异常提醒 (alert)', value: 'alert' },
  { label: '补偿 (compensate)', value: 'compensate' },
];

// 附录 C.6 约束名称字典
const CONSTRAINT_NAMES = [
  { label: '时间范围 (time)', value: 'time' },
  { label: '时间窗口 (timeWindow)', value: 'timeWindow' },
  { label: '限制地域 (region)', value: 'region' },
  { label: '网络地址 (networkAddress)', value: 'networkAddress' },
  { label: '物理地址 (physicalAddress)', value: 'physicalAddress' },
  { label: '使用次数 (count)', value: 'count' },
  { label: '使用频次 (frequency)', value: 'frequency' },
  { label: '数据规模 (dataSize)', value: 'dataSize' },
  { label: '数据记录数 (dataRecord)', value: 'dataRecord' },
  { label: '数据字段 (dataField)', value: 'dataField' },
  { label: '数据字段值 (valueExpression)', value: 'valueExpression' },
  { label: '应用程序 (application)', value: 'application' },
  { label: '算法 (algorithm)', value: 'algorithm' },
  { label: '机器学习模型 (machineLearningModels)', value: 'machineLearningModels' },
  { label: '执行环境 (executionEnv)', value: 'executionEnv' },
  { label: '加密方式 (encryptMode)', value: 'encryptMode' },
  { label: '交付方式 (deliveryMethod)', value: 'deliveryMethod' },
  { label: '交易金额 (payAmount)', value: 'payAmount' },
];

// 表 5.2 约束运算符号
const OPERATORS = [
  { label: '等于 (eq)', value: 'eq' },
  { label: '大于 (gt)', value: 'gt' },
  { label: '大于或等于 (gteq)', value: 'gteq' },
  { label: '小于 (lt)', value: 'lt' },
  { label: '小于或等于 (lteq)', value: 'lteq' },
  { label: '不等于 (neq)', value: 'neq' },
  { label: '包含部分 (hasPart)', value: 'hasPart' },
  { label: '属于部分 (isPartOf)', value: 'isPartOf' },
  { label: '属于实例 (isA)', value: 'isA' },
  { label: '全部属于 (isAllOf)', value: 'isAllOf' },
  { label: '任意属于 (isAnyOf)', value: 'isAnyOf' },
  { label: '不属于 (isNoneOf)', value: 'isNoneOf' },
];

const PolicyForm: React.FC = () => {
  return (
    <>
      <ProFormRadio.Group
        name="policyType"
        label="策略类型"
        options={POLICY_TYPES}
        initialValue="permission"
        rules={[{ required: true }]}
      />
      <Divider style={{ margin: '12px 0' }} />
      
      <Typography.Title level={5}>操作行为 (Actions)</Typography.Title>
      <ProFormSelect
        name="actions"
        label="选择操作行为"
        mode="multiple"
        placeholder="请选择符合标准定义的操作"
        options={ACTION_OPTIONS}
        rules={[{ required: true }]}
      />

      <Divider />
      <Typography.Title level={5}>约束条件 (Constraints)</Typography.Title>
      <ProFormList
        name="constraints"
        creatorButtonProps={{
          creatorButtonText: '添加约束条件',
        }}
      >
        <ProFormGroup key="group">
          <ProFormSelect
            name="constraintName"
            label="约束名称"
            width={260}
            options={CONSTRAINT_NAMES}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="constraintOperator"
            label="运算符"
            width={140}
            options={OPERATORS}
            rules={[{ required: true }]}
          />
          <ProFormText
            name="constraintValue"
            label="约束值"
            width={200}
            placeholder="输入值"
            rules={[{ required: true }]}
          />
        </ProFormGroup>
      </ProFormList>
    </>
  );
};

export default PolicyForm;