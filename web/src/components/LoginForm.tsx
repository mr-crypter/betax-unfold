import { useOkto } from 'okto-sdk-react';
import React from 'react';
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface AuthResponse {
  auth_token: string;
}

interface LoginFormProps {
  setAuthToken: (token: string | null) => void;
  authToken: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setAuthToken, authToken }) => {
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
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 border border-gray-700 rounded-lg shadow-[4px_0_24px_-2px_rgba(0,0,0,0.3)]">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Welcome to BetaX</h2>
          <p className="text-sm text-gray-300">Join us on our journey to migrate from Web2 to Web3!</p>
        </div>

        {!authToken ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-all duration-200">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error("Login Failed")}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};