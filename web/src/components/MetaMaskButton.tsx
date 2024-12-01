import React from 'react';

interface MetaMaskButtonProps {
  onClick: () => void;
  isConnecting: boolean;
  address: string;
}

export const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({
  onClick,
  isConnecting,
  address,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white 
                 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all 
                 duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isConnecting ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent" />
      ) : (
        <>
          <img
            src="/metamask.svg"
            alt="MetaMask"
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          />
          <span className="text-gray-700 font-medium">
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : 'Connect with MetaMask'}
          </span>
        </>
      )}
    </button>
  );
};