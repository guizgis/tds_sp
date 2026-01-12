import client from './client';

export interface Space {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  usagePolicies?: string[];
  resourceIds?: string[];
  createdAt: string;
}

export interface SpaceCreateRequest {
  name: string;
  description: string;
  usagePolicies?: string[];
}

export interface SpaceMember {
  participantId: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const getSpaces = async () => {
  const response = await client.get<Space[]>('/api/v1/space/spaces');
  return response.data;
};

export const createSpace = async (data: SpaceCreateRequest) => {
  const response = await client.post<Space>('/api/v1/space/spaces', data);
  return response.data;
};

export const updateSpace = async (id: string, data: Partial<SpaceCreateRequest> & { status?: string, resourceIds?: string[] }) => {
  const response = await client.put<Space>(`/api/v1/space/spaces/${id}`, data);
  return response.data;
};

export const deleteSpace = async (id: string) => {
  await client.delete(`/api/v1/space/spaces/${id}`);
};

export const getSpaceMembers = async (id: string) => {
  const response = await client.get<SpaceMember[]>(`/api/v1/space/spaces/${id}/members`);
  return response.data;
};

export const applyToSpace = async (id: string, data: { participantId: string, requestedRole: string, reason: string }) => {
  await client.post(`/api/v1/space/spaces/${id}/members/apply`, data);
};

export const approveMember = async (id: string, data: { applicationId: string, approved: boolean, assignedRole?: string }) => {
  await client.post(`/api/v1/space/spaces/${id}/members/approve`, data);
};

export const reportSpaceStatus = async (id: string) => {

  await client.post(`/api/v1/space/spaces/${id}/report`);

};



export const getUsageLogs = async (id: string) => {

  const response = await client.get<any[]>(`/api/v1/space/spaces/${id}/usage-logs`);

  return response.data;

};



export const simulateUsage = async (id: string, data: { resourceId: string, participantId: string, action: string, isViolation: boolean }) => {

  await client.post(`/api/v1/space/spaces/${id}/simulate-usage`, data);

};
