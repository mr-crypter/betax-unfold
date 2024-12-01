import React, { useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { BuildType, OktoProvider } from 'okto-sdk-react';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './contexts/AuthContext';


const OKTO_CLIENT_API_KEY = 'd6994eeb-3acb-4940-80ae-6c5534100908';

export const App: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
          <Routes>
            <Route path="/login" element={
              <LoginPage
                setAuthToken={setAuthToken}
                authToken={authToken}
                handleLogout={handleLogout}
              />
            } />
          </Routes>
        </OktoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};