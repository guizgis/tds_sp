import client from './client';

export interface CatalogItemRequest {
  name: string;
  catalogType: 'RESOURCE' | 'PRODUCT';
  description: string;
  usagePolicy?: string;
  topicCategory: string;
  industryCategory: string;
  organizationCategory: string;
  applicationCategory: string;
  sourceType: string;
  deliveryMode: string;
  updateFrequency: string;
  qualityLevel: string;
  securityLevel: string;
  serviceType: string;
  providerId: string;
  targetSpaceId?: string;
}

export interface CatalogItem extends CatalogItemRequest {
  id: string;
  version: string;
  status: string;
  createTime: string;
  updateTime: string;
  providerName?: string;
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

export const catalogApi = {
  register: (data: CatalogItemRequest) => client.post<CatalogItem>('/api/v1/catalog/catalogs', data),
  search: (params: { keyword?: string, catalogType?: string, topicCategory?: string, industryCategory?: string, status?: string, spaceId?: string }) => 
    client.get<CatalogItem[]>('/api/v1/catalog/catalogs', { params }),
  getDetail: (id: string) => client.get<CatalogItem>('/api/v1/catalog/catalogs/detail', { params: { id } }),
  update: (id: string, data: CatalogItemRequest) => client.put('/api/v1/catalog/catalogs/update', data, { params: { id } }),
  cancel: (id: string) => client.delete('/api/v1/catalog/catalogs/cancel', { params: { id } }),
  submitApplication: (id: string, data: UsageRequest) => client.post<UsageApplication>('/api/v1/catalog/catalogs/apply', data, { params: { id } }),
  listApplications: (providerId?: string) => client.get<UsageApplication[]>('/api/v1/catalog/applications', { params: { providerId } }),
  auditApplication: (id: string, approved: boolean) => client.post('/api/v1/catalog/applications/audit', { approved }, { params: { id } }),
  auditCatalog: (id: string, approved: boolean) => client.post('/api/v1/catalog/catalogs/audit', { approved }, { params: { id } }),
};
