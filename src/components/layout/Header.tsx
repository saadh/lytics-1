'use client';

import { useDashboardStore, useActiveView } from '@/store/dashboardStore';
import { Button } from '@/components/ui';
import { Menu, PanelLeftClose, PanelLeft, Save, LayoutDashboard, Building2, User } from 'lucide-react';
import { mockCompany } from '@/data/mockData';

export function Header() {
  const { sidebarOpen, toggleSidebar, setViewModalOpen } = useDashboardStore();
  const activeView = useActiveView();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle - Always visible */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-gray-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-gray-600" />
          )}
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Lytics</h1>
            <p className="text-xs text-gray-500 leading-tight">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {activeView && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-sm text-blue-700 font-medium">
              View: {activeView.name}
            </span>
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setViewModalOpen(true)}
          icon={<Save className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Save View</span>
        </Button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {mockCompany.name}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
