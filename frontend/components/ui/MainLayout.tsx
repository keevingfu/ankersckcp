/**
 * Main Layout Component
 * 主布局组件 - 包含侧边栏、顶栏和内容区域
 */

'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

export interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div
        className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'ml-16' : 'ml-72'}
        `}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
