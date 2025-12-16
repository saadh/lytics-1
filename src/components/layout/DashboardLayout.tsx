'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useDashboardStore } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useDashboardStore();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Fixed at top */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out',
          'pt-16', // Account for fixed header height
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
        )}
      >
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
