import client from './client';

export const identityApi = {
  // Register (NDI Standard Supplemental)
  registerPerson: (data: any) => client.post('/api/v1/identity/RegisterPerson', data),
  registerEnterprise: (data: any) => client.post('/api/v1/identity/RegisterEnterprise', data),
  registerOperator: (data: any) => client.post('/api/v1/identity/RegisterOperator', data),
  
  // Login Flow (NDI-TR-2025-03 Section 8)
  login: (identityCode: string) => client.post('/api/v1/identity/Login', { identityCode }),
  getToken: (authCode: string) => client.post('/api/v1/identity/GetToken', { authCode }),
  getPersonInfo: (token: string) => client.post('/api/v1/identity/GetPersonInfo', { token }),
  getEnterpriseInfo: (token: string) => client.post('/api/v1/identity/GetEnterpriseInfo', { token }),
  getOperatorInfo: (token: string) => client.post('/api/v1/identity/GetOperatorInfo', { token }),
  
  // Admin
  listRegistrations: (status: string = '0') => client.get(`/api/v1/identity/admin/registrations?status=${status}`),
  auditRegistration: (id: string, approved: boolean) => client.post(`/api/v1/identity/admin/registrations/${id}/audit`, { approved }),
  updateIdentityStatus: (id: string, status: string) => client.put(`/api/v1/identity/admin/identities/${id}/status`, { status }),
  deregisterIdentity: (id: string) => client.delete(`/api/v1/identity/admin/identities/${id}`),
};