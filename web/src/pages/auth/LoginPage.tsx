import React from 'react';
import { LoginForm } from '../../components/LoginForm';

interface LoginPageProps {
  setAuthToken: (token: string | null) => void;
  authToken: string | null;
  handleLogout: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setAuthToken, authToken, handleLogout }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <LoginForm
          setAuthToken={setAuthToken}
          authToken={authToken}
          handleLogout={handleLogout}
        />
      </div>
    </main>
  );
};