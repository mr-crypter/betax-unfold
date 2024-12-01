import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const LoginCard: React.FC = () => {
  const { connectWallet, address, isConnecting } = useWallet();

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <Wallet className="w-10 h-10 text-blue-600" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Connect your wallet to continue</p>
        </div>

        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg 
                   transition-colors duration-200 ease-in-out flex items-center justify-center space-x-2
                   disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <img src="/metamask.svg" alt="MetaMask" className="w-5 h-5" />
              <span>{address ? 'Connected' : 'Connect with MetaMask'}</span>
            </>
          )}
        </button>

        {address && (
          <div className="text-sm text-gray-500">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
}