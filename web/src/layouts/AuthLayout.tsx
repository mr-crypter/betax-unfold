import React from 'react';
import { Outlet } from 'react-router-dom';
import { WelcomeSection } from '../components/WelcomeSection';
import { MobileHeader } from '../components/MobileHeader';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 lg:bg-white">
      <MobileHeader />
      <WelcomeSection />
      <Outlet />
    </div>
  );
};