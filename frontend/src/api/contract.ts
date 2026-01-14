import axios from './client';

export interface BaseResponse {
  status: string;
}

export interface Constraint {
  constraintName: string;
  constraintOperator: string;
  constraintValue: string;
}

export interface ContractStrategy {
  subjectInfo: {
    dataProductId: string;
    dataProductName?: string;
  };
  executionNodeInfo: {
    providerNodeId: string;
    providerNodeName?: string;
    consumerNodeId?: string;
    consumerNodeName?: string;
  };
  actions: string[];
  constraints?: Constraint[];
  policyExpansion?: string;
}

export interface ContractCreateRequest {
  contractName: string;
  contractAbstract: string;
  issueTime: string;
  activationTime: string;
  endTime: string;
  signMode: '01' | '02';
  issuerId: string;
  issuerEntityId: string;
  signature: string;
  policySnapshot?: string;
}

export interface ContractCreateResponse extends BaseResponse {
  contractId: string;
}

export interface UsageRequest {
  applicantId: string;
  reason: string;
  expectedDuration?: string;
}

export interface UsageApplication {
  id: string;
  catalogId: string;
  catalogName: string;
  applicantId: string;
  providerId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submitTime: string;
}

export interface PolicyTemplate {
  id: number;
  name: string;
  description: string;
  policyConfig: string; // JSON string
  createTime: string;
}

export const policyTemplateApi = {
  list: () => axios.get<PolicyTemplate[]>('/api/v1/contract/policy-templates'),
  create: (data: Omit<PolicyTemplate, 'id' | 'createTime'>) => axios.post<PolicyTemplate>('/api/v1/contract/policy-templates', data),
  update: (id: number, data: Omit<PolicyTemplate, 'id' | 'createTime'>) => axios.put<PolicyTemplate>(`/api/v1/contract/policy-templates/${id}`, data),
  delete: (id: number) => axios.delete(`/api/v1/contract/policy-templates/${id}`),
};

export const contractApi = {
  getTemplates: (issuerId: string, issuerEntityId: string, templateId?: string) =>
    axios.post('/api/v1/contract/contractTemplate', { issuerId, issuerEntityId, templateId }),

  createContract: (data: ContractCreateRequest) =>
    axios.post<ContractCreateResponse>('/api/v1/contract/contractCreate', data),

  negotiateContract: (data: any) =>
    axios.post('/api/v1/contract/contractNegotiate', data),

  registrateContract: (data: any) =>
    axios.post('/api/v1/contract/contractRegistrate', data),

  terminateContract: (data: { contractId: string; issueTime: string; terminateType: string; issuerId: string; signature: string }) =>
    axios.post('/api/v1/contract/contractTerminate', data),
};
