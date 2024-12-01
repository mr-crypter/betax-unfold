import React from 'react';
import { LoginForm } from '../../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex-1">
      <LoginForm />
    </div>
  );
};