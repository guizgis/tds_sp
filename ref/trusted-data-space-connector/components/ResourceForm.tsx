import React, { useState } from 'react';

interface ResourceFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ onCancel, onSave }) => {
  const [selectedType, setSelectedType] = useState<'storage' | 'database' | 'file'>('database');

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background-light">
      {/* Top Header - mimicking the specialized form header in the design */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white/90 backdrop-blur-md px-6 py-3">
        <div className="flex items-center gap-4 text-slate-900">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">hub</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            可信数据空间连接器
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64 group">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full ring-1 ring-slate-200 group-focus-within:ring-primary transition-all">
              <div className="text-slate-400 flex border-none bg-slate-50 items-center justify-center pl-3 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none text-slate-900 focus:outline-0 focus:ring-0 border-none bg-slate-50 placeholder:text-slate-400 px-3 pl-2 text-sm font-normal leading-normal"
                placeholder="搜索资源..."
                defaultValue=""
              />
            </div>
          </label>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-slate-200 cursor-pointer"
              style={{
                backgroundImage:
                  'url("https://picsum.photos/seed/user_avatar_1/100/100")',
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="flex flex-col max-w-[1024px] flex-1 w-full gap-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex px-1">
            <ol className="flex items-center space-x-2">
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); }} 
                  className="text-slate-500 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm align-middle">
                    home
                  </span>
                </a>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li>
                <a
                  href="#"
                   onClick={(e) => { e.preventDefault(); onCancel(); }}
                  className="text-slate-500 text-sm font-medium hover:text-primary transition-colors"
                >
                  连接器管理
                </a>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li>
                <span
                  aria-current="page"
                  className="text-slate-900 text-sm font-medium"
                >
                  数据资源接入配置
                </span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900">
              数据资源接入配置
            </h1>
            <p className="text-slate-500 text-base max-w-2xl">
              配置外部数据源的连接参数，以便安全地接入可信数据空间。连接器将作为访问入口，支持对数据资源的索引和合规使用。
            </p>
          </div>

          {/* Step 1: Resource Type */}
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">
                1
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                选择数据源类型
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TypeCard
                id="storage"
                icon="cloud_queue"
                title="对象存储"
                desc="AWS S3, MinIO, 阿里云 OSS"
                color="blue"
                checked={selectedType === 'storage'}
                onChange={() => setSelectedType('storage')}
              />
              <TypeCard
                id="database"
                icon="database"
                title="关系型数据库"
                desc="MySQL, PostgreSQL, Oracle"
                color="emerald"
                checked={selectedType === 'database'}
                onChange={() => setSelectedType('database')}
              />
              <TypeCard
                id="file"
                icon="folder_open"
                title="本地文件服务器"
                desc="SFTP, 本地文件系统"
                color="purple"
                checked={selectedType === 'file'}
                onChange={() => setSelectedType('file')}
              />
            </div>
          </section>

          {/* Form Container */}
          <section className="flex flex-col gap-6 mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {/* Step 2: Basic Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">
                  2
                </span>
                <h2 className="text-lg font-bold text-slate-900">基本信息</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    资源名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Sales_Analytics_DB"
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 transition-colors"
                    placeholder="例如：销售分析数据库"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    子类型
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                      <option>MySQL</option>
                      <option>PostgreSQL</option>
                      <option>Oracle DB</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    描述
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 transition-colors"
                    placeholder="描述此数据源的用途和内容..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200 w-full"></div>

            {/* Step 3: Connection Details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">
                  3
                </span>
                <h2 className="text-lg font-bold text-slate-900">连接详情</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    主机地址 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        dns
                      </span>
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                      placeholder="192.168.1.100 或 db.example.com"
                    />
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    端口 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    defaultValue={3306}
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-12 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    数据库名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="production_db"
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-6 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    用户名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:col-span-6 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    密码 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        vpn_key
                      </span>
                    </span>
                    <input
                      type="password"
                      className="w-full rounded-lg bg-slate-50 border border-slate-300 text-slate-900 pl-10 pr-10 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="mt-2">
              <details className="group rounded-lg border border-slate-200 bg-slate-50 overflow-hidden transition-all duration-300 open:pb-4">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none select-none">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      tune
                    </span>
                    高级配置
                  </span>
                  <span className="transition-transform group-open:rotate-180">
                    <span className="material-symbols-outlined">expand_more</span>
                  </span>
                </summary>
                <div className="px-4 pt-2 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-ssl"
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-primary"
                        />
                        <label
                          htmlFor="toggle-ssl"
                          className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"
                        ></label>
                      </div>
                      <label htmlFor="toggle-ssl" className="text-slate-700 cursor-pointer">
                        启用 SSL/TLS 加密连接
                      </label>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-500">
                        连接超时 (毫秒)
                      </label>
                      <input
                        type="number"
                        defaultValue="5000"
                        className="w-full rounded bg-white border border-slate-300 text-slate-900 px-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-4 pt-6 border-t border-slate-200">
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-transparent text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    bolt
                  </span>
                  测试连接
                </button>
                <button
                  onClick={onSave}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform hover:translate-y-px active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  保存并连接
                </button>
              </div>
            </div>
          </section>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-sm">
            <span className="material-symbols-outlined text-blue-600 shrink-0">
              info
            </span>
            <p className="text-blue-800">
              <strong>安全提示：</strong> 您的凭据在存储前均经过 AES-256
              加密处理。连接器仅发起出站连接，通常无需配置入站防火墙策略。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Resource Type Card
const TypeCard: React.FC<{
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: 'blue' | 'emerald' | 'purple' | 'orange';
  checked: boolean;
  onChange: () => void;
}> = ({ id, icon, title, desc, color, checked, onChange }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <label className="cursor-pointer group relative">
      <input
        type="radio"
        name="source_type"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="flex flex-col h-full p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
        <div
          className={`mb-3 size-12 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
        <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
          <span className="material-symbols-outlined fill-current">
            check_circle
          </span>
        </div>
      </div>
    </label>
  );
};