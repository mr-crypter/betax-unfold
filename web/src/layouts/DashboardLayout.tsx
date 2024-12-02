import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};