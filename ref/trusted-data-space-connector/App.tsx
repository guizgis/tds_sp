import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResourceList } from './components/ResourceList';
import { ResourceForm } from './components/ResourceForm';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LIST);

  return (
    <div className="flex min-h-screen w-full bg-background-light">
      {/* Sidebar - Only visible in LIST view on desktop, or consistent depending on design.
          The design shows Sidebar for Dashboard, but full width for Form.
      */}
      {currentView === ViewState.LIST && (
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as ViewState)}
        />
      )}

      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile Header (Only for List view) */}
        {currentView === ViewState.LIST && (
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-surface-light lg:hidden sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <button className="p-2 -ml-2 text-slate-600">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <span className="font-bold text-lg">可信数据空间</span>
            </div>
            <div
              className="size-8 rounded-full bg-slate-200 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://picsum.photos/seed/user_avatar_1/100/100")',
              }}
            ></div>
          </header>
        )}

        {/* View Switcher */}
        {currentView === ViewState.LIST ? (
          <ResourceList onAddResource={() => setCurrentView(ViewState.FORM)} />
        ) : (
          <ResourceForm
            onCancel={() => setCurrentView(ViewState.LIST)}
            onSave={() => {
              // Simulate save logic
              setTimeout(() => setCurrentView(ViewState.LIST), 500);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;