import React, { useState } from "react";
import { motion } from "framer-motion";

const DataInputField: React.FC<{ onFetch: () => void }> = ({ onFetch }) => {
  const [url, setUrl] = useState("https://s3://peri-peri-fries/trial/test1.parquet");
  const [structureType, setStructureType] = useState("Parquet");
  const [cloudProvider, setCloudProvider] = useState("AWS");
  const [regionName, setRegionName] = useState("ap-south-1");
  const [isProtected, setIsProtected] = useState(true);
  const [accessId, setAccessId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [connectionString, setConnectionString] = useState("");
  const regionNames = [
    "ap-south-1",
    "ap-northeast-2",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "ca-central-1",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "sa-east-1",
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
  ];

  return (
    <div className="space-y-6 overflow-visible">
      {/* Cloud Provider and File Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.01 }} 
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor="cloud-provider"
            className="block text-white font-medium mb-2 text-sm tracking-wide"
          >
            Select Cloud Provider
          </label>
          <div className="relative">
            <select
              name="cloud-provider"
              id="cloud-provider"
              value={cloudProvider}
              onChange={(e) => setCloudProvider(e.target.value)}
              className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
            >
              <option value="">Select Cloud Provider</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="MinIO">MinIO</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }} 
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor="file-type"
            className="block text-white font-medium mb-2 text-sm tracking-wide"
          >
            File Type
          </label>
          <div className="relative">
            <select
              name="file-type"
              id="file-type"
              value={structureType}
              onChange={(e) => setStructureType(e.target.value)}
              className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
            >
              <option value="Parquet">Parquet</option>
              <option value="Iceberg">Iceberg</option>
              <option value="Delta">Delta</option>
              <option value="Hudi">Hudi</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Region Name and Dataset URI - Adjusted width ratio */}
      <div className="grid grid-cols-5 gap-6">
        <motion.div 
          className="relative col-span-2" 
          whileHover={{ scale: 1.01 }} 
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor="region-name"
            className="block text-white font-medium mb-2 text-sm tracking-wide"
          >
            Select Region
          </label>
          <div className="relative">
            <select
              name="region-name"
              id="region-name"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none"
            >
              {regionNames.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-span-3"
          whileHover={{ scale: 1.01 }} 
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor="url"
            className="block text-white font-medium mb-2 text-sm tracking-wide"
          >
            Enter Dataset URI
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-ellipsis overflow-hidden"
            placeholder="Enter URI or file path..."
          />
        </motion.div>
      </div>

      {/* Protected Toggle and Authentication Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium text-sm tracking-wide">Protected?</span>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ease-in-out duration-200 cursor-pointer ${
              isProtected ? "bg-purple-500" : "bg-gray-500"
            }`}
            onClick={() => setIsProtected(!isProtected)}
          >
            <span
              className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition ease-in-out duration-300 ${
                isProtected ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </motion.div>
        </div>

        {isProtected && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800/90 p-5 rounded-lg border border-purple-500/30 shadow-lg"
          >
            {cloudProvider === "AWS" && (
              <>
                <div>
                  <label
                    htmlFor="access-id"
                    className="block text-white text-sm font-medium mb-2 tracking-wide"
                  >
                    IAM Access ID
                  </label>
                  <input
                    type="text"
                    id="access-id"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter IAM Access ID"
                  />
                </div>
                <div>
                  <label
                    htmlFor="secret-key"
                    className="block text-white text-sm font-medium mb-2 tracking-wide"
                  >
                    IAM Secret Access Key
                  </label>
                  <input
                    type="password"
                    id="secret-key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter IAM Secret Access Key"
                  />
                </div>
              </>
            )}

            {(cloudProvider === "Azure" || cloudProvider === "MinIO") && (
              <div className="col-span-2">
                <label
                  htmlFor="connection-string"
                  className="block text-white text-sm font-medium mb-2 tracking-wide"
                >
                  IAM Connection String
                </label>
                <input
                  type="text"
                  id="connection-string"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  className="w-full p-3 pl-4 border border-purple-600/40 rounded-md bg-gray-800/80 text-white shadow-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter IAM Connection String"
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Fetch Button */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-gray-400 text-sm italic">
          Ensure all fields are filled correctly.
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onFetch}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:cursor-pointer"
        >
          Fetch Dataset
        </motion.button>
      </div>
    </div>
  );
};

export default DataInputField;