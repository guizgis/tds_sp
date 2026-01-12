import axios from './client';

export interface ConnectorBaseInfo {
  connectorName: string;
  connectorIpList?: string[];
  connectorDomainList?: string[];
  connectorJoinType: string;
  enterpriseName?: string;
  enterpriseCode: string;
}

export interface ConnectorExtendInfo {
  supplierName?: string;
  supplierCode?: string;
  connectorSN?: string;
  connectorVersion?: string;
  connectorType: string;
  connectorMac: string;
}

export interface ConnectorRegisterRequest {
  baseInfo: ConnectorBaseInfo;
  extendInfo: ConnectorExtendInfo;
  attachInfo?: any[];
}

export const connectorApi = {
  register: (data: ConnectorRegisterRequest) =>
    axios.post('/api/v1/connector/connectors', data),
    
  getRoots: () =>
    axios.get('/api/v1/connector/GetIdentityProviderList'),
    
  deregister: (identityCode: string, reason: string) =>
    axios.post('/api/v1/connector/connectors/deregister', { identityCode, reason }),
    
  getDetail: (id: string) =>
    axios.get(`/api/v1/connector/connectors/${id}`),
    
  getStatus: (id: string) =>
    axios.get(`/api/v1/connector/connectors/${id}/status`),
};
