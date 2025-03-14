import React, { useState } from 'react';

const DataInputPage: React.FC = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-blue-900 to-purple-950 text-white">
        <div className="flex items-center">
          <button className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="font-medium text-sm">CREDENTIAL</span>
            <span className="text-xs">Management</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">ADVANCED</span>
          <span className="text-xs">Data Discovery</span>
        </div>
        <button className="rounded-full bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gray-900">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-white mb-1">Enter URI to start analyzing data files</h1>
          <p className="text-gray-300 text-sm">Click Advanced to handle complete datasets</p>
        </div>
        
        <div className="flex w-full max-w-2xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-md py-2 px-4 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder=""
          />
          <button className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 hover:cursor-pointer font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Fetch
          </button>
        </div>
      </main>
    </div>
  );
};

export default DataInputPage;