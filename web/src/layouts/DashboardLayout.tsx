import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};