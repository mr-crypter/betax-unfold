import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export const useWallet = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setAddress(accounts[0].address);
      }
    } catch (error) {
      console.error('Error checking if wallet is connected:', error);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAddress(address);
      return address;

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Please connect to MetaMask.');
      } else {
        toast.error('Failed to connect wallet');
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };


  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        setAddress(await signer.getAddress());
      } else {
        setAddress('');
      }
    };

    const handleDisconnect = () => {
      setAddress('');
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('disconnect', handleDisconnect);
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  // Check connection status on mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  return {
    connectWallet,
   
    address,
    isConnecting,
  };
};