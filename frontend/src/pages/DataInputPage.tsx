import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DataInputPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [structureType, setStructureType] = useState('Parquet');
  const [cloudProvider, setCloudProvider] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [accessId, setAccessId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [connectionString, setConnectionString] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="w-10 h-10 border-4 border-t-purple-600 border-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-3 text-white font-light">Loading</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <div className="absolute w-full h-full bg-gradient-to-b from-purple-900/30 to-transparent opacity-50"></div>
      <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-purple-900 to-transparent"></div>

      <header className="relative z-10 flex justify-between items-center px-4 py-4 bg-gradient-to-r from-purple-900 to-purple-800 text-white">
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="font-medium text-sm z-10 right-">CREDENTIAL</span>
            <span className="text-xs">Management</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium text-sm">ADVANCED</span>
          <span className="text-xs">Data Discovery</span>
        </div>
        <button className="rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-white mb-6">Enter URI to start analyzing data files</h1>
          
          <div className="mb-6">
            <label htmlFor="cloud-provider" className="block text-left text-white font-medium mb-2">Select Cloud Provider</label>
            <select 
              name="cloud-provider" 
              id="cloud-provider" 
              value={cloudProvider}
              onChange={(e) => setCloudProvider(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-700 text-white shadow-sm focus:ring focus:ring-purple-500"
            >
              <option value="">Select Cloud Provider</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="MinIO">MinIO</option>
            </select>
          </div>
        </div>
        
        <div className="w-full max-w-2xl ">
          <div className="flex mb-6">
            <div className="mr-2">
              <select 
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="h-full rounded-l py-2 px-4 bg-gray-700 text-white focus:outline-none border-r border-gray-600"
              >
                <option value="Parquet">Parquet</option>
                <option value="Iceberg">Iceberg</option>
                <option value="Delta">Delta</option>
                <option value="Hudi">Hudi</option>
              </select>
            </div>
            <div className="flex flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 py-2 px-4 bg-gray-700 text-white focus:outline-none"
                placeholder="Enter URI or file path..."
              />
              <button className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-r hover:cursor-pointer">
                Fetch
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <span className="text-white mr-3 font-medium">Protected?</span>
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ease-in-out duration-200 ${isProtected ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => setIsProtected(!isProtected)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200 ${isProtected ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </div>
          </div>
          
          {isProtected && (
            <div className="bg-gray-800 rounded-md p-4 mt-4">
              <h3 className="text-white font-medium mb-4">Authentication Details</h3>
              
              {cloudProvider === 'AWS' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="access-id" className="block text-white text-sm font-medium mb-1">IAM Access ID</label>
                    <input
                      type="text"
                      id="access-id"
                      value={accessId}
                      onChange={(e) => setAccessId(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-purple-500"
                      placeholder="Enter IAM Access ID"
                    />
                  </div>
                  <div>
                    <label htmlFor="secret-key" className="block text-white text-sm font-medium mb-1">IAM Secret Access Key</label>
                    <input
                      type="password"
                      id="secret-key"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-purple-500"
                      placeholder="Enter IAM Secret Access Key"
                    />
                  </div>
                </div>
              )}
              
              {(cloudProvider === 'Azure' || cloudProvider === 'MinIO') && (
                <div>
                  <label htmlFor="connection-string" className="block text-white text-sm font-medium mb-1">IAM Connection String</label>
                  <input
                    type="text"
                    id="connection-string"
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-purple-500"
                    placeholder="Enter IAM Connection String"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DataInputPage;