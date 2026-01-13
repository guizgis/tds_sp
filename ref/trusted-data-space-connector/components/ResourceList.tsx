import React from 'react';
import { Resource } from '../types';

interface ResourceListProps {
  onAddResource: () => void;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    name: 'Sensors_Production_DB',
    subTitle: 'PostgreSQL v14',
    resId: 'res_8372_xk92',
    type: 'database',
    typeName: '关系型数据库',
    status: 'online',
    statusText: '已连接',
    lastSync: '10分钟前',
  },
  {
    id: '2',
    name: 'External_Sales_API',
    subTitle: 'REST Interface',
    resId: 'res_9921_mm21',
    type: 'api',
    typeName: 'Web 接口',
    status: 'error',
    statusText: '连接异常',
    lastSync: '2天前',
  },
  {
    id: '3',
    name: 'Archive_Logs_2023',
    subTitle: 'AWS S3 Bucket',
    resId: 'res_1102_aa00',
    type: 'storage',
    typeName: '对象存储',
    status: 'disabled',
    statusText: '已停用',
    lastSync: '1个月前',
  },
  {
    id: '4',
    name: 'Customer_Support_DB',
    subTitle: 'MySQL v8.0',
    resId: 'res_7721_pp99',
    type: 'database',
    typeName: '关系型数据库',
    status: 'online',
    statusText: '已连接',
    lastSync: '刚刚',
  },
];

export const ResourceList: React.FC<ResourceListProps> = ({ onAddResource }) => {
  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'online':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' };
      case 'error':
        return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      case 'disabled':
        return { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-400' };
    }
  };

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'database':
        return { icon: 'database', bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'api':
        return { icon: 'api', bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'storage':
        return { icon: 'folder', bg: 'bg-orange-100', text: 'text-orange-600' };
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <a href="#" className="text-slate-500 hover:text-primary transition-colors">
          首页
        </a>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-900">已接入数据资源</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            已接入数据资源管理
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            可信数据空间连接器产品，作为用户接入可信数据空间服务平台、访问和使用可信数据空间资源的入口。
          </p>
        </div>
        <button
          onClick={onAddResource}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>接入新资源</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary sm:text-sm"
            placeholder="请输入资源名称或ID进行搜索..."
            type="text"
          />
        </div>
        <div className="md:col-span-3">
          <select className="block w-full py-2.5 px-3 border-none rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary sm:text-sm cursor-pointer">
            <option value="">资源类型: 全部</option>
            <option value="database">数据库 (Database)</option>
            <option value="api">API 接口</option>
            <option value="file">文件存储</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select className="block w-full py-2.5 px-3 border-none rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary sm:text-sm cursor-pointer">
            <option value="">连接状态: 全部</option>
            <option value="online">在线 (Online)</option>
            <option value="offline">离线 (Offline)</option>
            <option value="error">异常 (Error)</option>
          </select>
        </div>
        <div className="md:col-span-1 flex justify-end">
          <button
            className="w-full md:w-auto flex items-center justify-center p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="重置筛选"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
              <tr>
                <th scope="col" className="px-6 py-4">资源名称</th>
                <th scope="col" className="px-6 py-4">资源 ID</th>
                <th scope="col" className="px-6 py-4">类型</th>
                <th scope="col" className="px-6 py-4">连接状态</th>
                <th scope="col" className="px-6 py-4">最近同步</th>
                <th scope="col" className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {RESOURCES.map((res) => {
                const iconStyle = getIcon(res.type);
                const statusStyle = getStatusColor(res.status);
                return (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded ${iconStyle.bg} ${iconStyle.text} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-lg">{iconStyle.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{res.name}</div>
                          <div className="text-xs text-slate-500">{res.subTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 select-all">
                      {res.resId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{res.typeName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`size-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {res.statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{res.lastSync}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="查看详情">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="编辑配置">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors" title="删除资源">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-500">
            显示第 <span className="font-medium text-slate-900">1-4</span> 条，共{' '}
            <span className="font-medium text-slate-900">12</span> 条资源
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="size-8 rounded bg-primary text-white text-sm font-medium flex items-center justify-center">
                1
              </button>
              <button className="size-8 rounded hover:bg-slate-200 text-slate-600 text-sm font-medium flex items-center justify-center transition-colors">
                2
              </button>
              <button className="size-8 rounded hover:bg-slate-200 text-slate-600 text-sm font-medium flex items-center justify-center transition-colors">
                3
              </button>
            </div>
            <button className="p-2 rounded hover:bg-slate-200 text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};