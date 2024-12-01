import React from 'react';
import { Wallet } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  return (
    <div className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
      <div className="flex items-center justify-center space-x-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Welcome to MetaMask</h1>
          <p className="text-blue-100 text-sm">Connect your wallet securely</p>
        </div>
      </div>
    </div>
  );
}