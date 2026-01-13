export interface Resource {
  id: string;
  name: string;
  subTitle: string;
  resId: string;
  type: 'database' | 'api' | 'storage';
  typeName: string;
  status: 'online' | 'offline' | 'error' | 'disabled';
  statusText: string;
  lastSync: string;
}

export enum ViewState {
  LIST = 'LIST',
  FORM = 'FORM',
}

export interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
}