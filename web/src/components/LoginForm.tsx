import { useOkto } from 'okto-sdk-react';
import React from 'react';
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface AuthResponse {
  auth_token: string;
}

interface LoginFormProps {
  setAuthToken: (token: string | null) => void;
  authToken: string | null;
  handleLogout: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setAuthToken, authToken, handleLogout }) => {
  const okto = useOkto();

  const handleGoogleLogin = async ({ credential }: CredentialResponse) => {
    if (!okto?.authenticate || !credential) return;

    try {
      okto.authenticate(credential, (authResponse: AuthResponse, error: Error) => {
        if (error) {
          console.error("Authentication error:", error);
          return;
        }
        
        if (authResponse) {
          setAuthToken(authResponse.auth_token);
          console.log("Authenticated successfully, auth token:", authResponse.auth_token);
        }
      });
    } catch (err) {
      console.error("Unexpected error during authentication:", err);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center w-full m lg:py-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">Welcome to BetaX</h2>
        <p className="mt-3 text-sm text-gray-600">Join us on our journey to migrate from Web2 to Web3!</p>
      </div>

      <div className="mt-10 px-6 py-8 bg-white w-full max-w-md mx-auto">
        {!authToken ? (
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 shadow-sm p-2 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error("Login Failed")}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-green-600">Successfully logged in!</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};