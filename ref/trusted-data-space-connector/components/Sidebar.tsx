import React from 'react';
import { NavItem } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'dashboard', label: '概览', active: false },
  { icon: 'database', label: '资源管理', active: true },
  { icon: 'cable', label: '连接器配置', active: false },
  { icon: 'history', label: '审计日志', active: false },
  { icon: 'settings', label: '系统设置', active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-surface-light flex-col hidden lg:flex sticky top-0 h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3 text-slate-900 cursor-pointer" onClick={() => onNavigate('LIST')}>
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight">可信数据空间</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-slate-200"
            style={{
              backgroundImage:
                'url("https://picsum.photos/seed/user_avatar_1/100/100")',
            }}
          ></div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              系统管理员
            </span>
            <span className="text-xs text-slate-500">XX 科技有限公司</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => { e.preventDefault(); if(item.label === '资源管理') onNavigate('LIST'); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`material-symbols-outlined ${item.active ? 'filled-icon' : ''}`}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">退出登录</span>
        </button>
      </div>
    </aside>
  );
};