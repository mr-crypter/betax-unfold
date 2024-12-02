import React from 'react';
import { LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {


  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">MetaMask Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            Wallet Address
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = '/'
              }}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};