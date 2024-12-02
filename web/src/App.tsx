import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { BuildType, OktoProvider } from 'okto-sdk-react';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';

const OKTO_CLIENT_API_KEY = 'd6994eeb-3acb-4940-80ae-6c5534100908';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </OktoProvider>
    </BrowserRouter>
  );
};

const AppRoutes: React.FC = () => {
  const { authToken, setAuthToken } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          authToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              setAuthToken={setAuthToken}
              authToken={authToken}
            />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          !authToken ? (
            <Navigate to="/" replace />
          ) : (
            <DashboardLayout />
          )
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};
