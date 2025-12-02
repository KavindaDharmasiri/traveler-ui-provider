import React from 'react';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#217964]"></div>
        <div className="absolute inset-0 animate-pulse">
          <div className="rounded-full h-16 w-16 bg-[#217964]/10"></div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-[#217964] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#217964] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#217964] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;