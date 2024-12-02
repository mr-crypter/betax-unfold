import React from 'react';
import { LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">MetaMask Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Wallet Address</span>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = '/'
              }}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
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