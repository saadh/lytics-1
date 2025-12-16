'use client';

import { useDashboardStore, useActiveView } from '@/store/dashboardStore';
import { Button } from '@/components/ui';
import { Menu, Save, LayoutDashboard, Building2, User } from 'lucide-react';
import { mockCompany } from '@/data/mockData';

export function Header() {
  const { toggleSidebar, setViewModalOpen } = useDashboardStore();
  const activeView = useActiveView();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="lg:hidden p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900">Lytics</h1>
            <p className="text-xs text-gray-500">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activeView ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700 font-medium">
              View: {activeView.name}
            </span>
          </div>
        ) : null}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setViewModalOpen(true)}
          icon={<Save className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Save View</span>
        </Button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              {mockCompany.name}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
