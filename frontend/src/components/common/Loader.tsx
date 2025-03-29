import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full py-10">
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.24,0,0.38,1)_infinite]"></div>
        <div className="absolute inset-[10px] bg-cyan-500/10 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.24,0,0.38,1)_infinite_0.2s]"></div>
        <div className="absolute inset-[25px] bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-[data-pulse_1.5s_ease-in-out_infinite]">
          <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.231-1.48-.634-2.026M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.231-1.48.634-2.026m0 0a5.002 5.002 0 019.732 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Exploring Metadata
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Extracting insights from your data universe
        </p>
      </div>

      {/* Use global styles instead of inline jsx style */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.33);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        @keyframes data-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Loader;