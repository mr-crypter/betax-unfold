import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<void>;
  walletAddress: string;
  isConnecting: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Check for previously logged-out state
  useEffect(() => {
    const wasLoggedOut = localStorage.getItem('wasLoggedOut') === 'true';

    const checkConnection = async () => {
      try {
        if (!window.ethereum || wasLoggedOut) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setIsAuthenticated(true);
      } else {
        setWalletAddress('');
        setIsAuthenticated(false);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const login = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsAuthenticated(true);
      localStorage.removeItem('wasLoggedOut');
      
      navigate('/dashboard');
      toast.success('Successfully logged in with MetaMask!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 4001) {
        toast.error('Please connect to MetaMask.');
      } else {
        toast.error('Login failed');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      if (window.ethereum) {
        setWalletAddress('');
        setIsAuthenticated(false);
        setIsConnecting(false);
      }

      // Mark the user as logged out
      localStorage.setItem('wasLoggedOut', 'true');

      // Clear any stored data/cookies if needed
      localStorage.clear();
      sessionStorage.clear();

      navigate('/login');
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout');
    }
  }, [navigate]);

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

      setWalletAddress(address);
      setIsAuthenticated(true);

      // Clear the logout state on successful connection
      localStorage.removeItem('wasLoggedOut');

      navigate('/dashboard');
      toast.success('Successfully connected to MetaMask!');
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        toast.error('Please connect to MetaMask.');
      } else {
        toast.error('Failed to connect to MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        connectWallet,
        walletAddress,
        isConnecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};