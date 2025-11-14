'use client';

import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
