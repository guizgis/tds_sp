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
}

export interface ContractCreateResponse extends BaseResponse {
  contractId: string;
}

export const contractApi = {
  getTemplates: (issuerId: string, issuerEntityId: string, templateId?: string) =>
    axios.post('/contract/contractTemplate', { issuerId, issuerEntityId, templateId }),

  createContract: (data: ContractCreateRequest) =>
    axios.post<ContractCreateResponse>('/contract/contractCreate', data),

  negotiateContract: (data: any) =>
    axios.post('/contract/contractNegotiate', data),

  registrateContract: (data: any) =>
    axios.post('/contract/contractRegistrate', data),

  terminateContract: (data: { contractId: string; issueTime: string; terminateType: string; issuerId: string; signature: string }) =>
    axios.post('/contract/contractTerminate', data),
};
