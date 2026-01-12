export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface UserInfo {
  identityCode: string;
  role: UserRole;
  name: string;
}

export const getAuthInfo = (): UserInfo | null => {
  const info = localStorage.getItem('tds_auth');
  return info ? JSON.parse(info) : null;
};

export const setAuthInfo = (info: UserInfo) => {
  localStorage.setItem('tds_auth', JSON.stringify(info));
};

export const clearAuthInfo = () => {
  localStorage.removeItem('tds_auth');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('tds_auth');
};
