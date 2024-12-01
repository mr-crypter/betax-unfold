import React from 'react';

export const WelcomeSection: React.FC = () => {
  const handleGoogleSignIn = () => {
    // Add Google sign in logic here
  };

  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#574b90] to-[#786fa6] p-8 xl:p-12 items-center justify-center">
      <div className="text-center max-w-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 xl:w-32 xl:h-32 flex items-center justify-center transition-all duration-300">
            {/* <Google className="w-12 h-12 xl:w-16 xl:h-16 text-white animate-pulse" /> */}
            <div className="text-white text-2xl xl:text-6xl font-bold bg-gradient-to-r from-[#4b908f] to-white bg-clip-text text-transparent">
              BetaX
            </div>
          </div>
        </div>
        <h1 className="text-3xl xl:text-5xl font-bold text-white mb-6 tracking-tight">
          Welcome to <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">Betax</span>
        </h1>
        <p className="text-blue-100 text-base xl:text-lg max-w-md mx-auto leading-relaxed font-light mb-8">
          Sign in with Google to get started. Join our community and explore all the features we offer.
        </p>

      </div>
    </div>
  );
};