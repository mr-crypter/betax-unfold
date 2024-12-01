import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Update authentication state when token changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  }, [authToken]);

  const handleSetAuthToken = (token: string | null) => {
    setAuthToken(token);
    if (token) {
      navigate('/dashboard');
      toast.success('Successfully logged in!');
    }
  };

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
    toast.success('Successfully logged out');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        setAuthToken: handleSetAuthToken,
        logout
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