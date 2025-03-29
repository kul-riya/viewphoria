import React, { useState } from "react";

const DataInputField: React.FC<{ onFetch: () => void }> = ({ onFetch }) => {
  const [url, setUrl] = useState("https://s3://peri-peri-fries/trial/test1.parquet");
  const [structureType, setStructureType] = useState("Parquet");
  const [cloudProvider, setCloudProvider] = useState("AWS");
  const [isProtected, setIsProtected] = useState(false);
  const [accessId, setAccessId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [connectionString, setConnectionString] = useState("");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-white mb-6">
          ENTER URI TO START ANALYZING DATASETS
        </h1>

        <div className="mb-4">
          <label
            htmlFor="cloud-provider"
            className="block text-left text-white font-medium mb-2"
          >
            Select Cloud Provider
          </label>
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

      <div className="flex mb-4">
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
            className="w-full flex-1 py-2 px-4 bg-gray-700 text-white focus:outline-none"
            placeholder="Enter URI or file path..."
          />
          <button
            onClick={onFetch}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-r hover:bg-purple-700 transition-colors"
          >
            Fetch
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6 justify-center">
        <span className="text-white mr-3 font-medium">Protected?</span>
        <div
          className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ease-in-out duration-200 cursor-pointer ${
            isProtected ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => setIsProtected(!isProtected)}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200 ${
              isProtected ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </div>
      </div>

      {isProtected && (
        <div className="bg-gray-800 rounded-md p-4 mt-3">
          <h3 className="text-white font-medium mb-2">
            Authentication Details
          </h3>

          {cloudProvider === "AWS" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="access-id"
                  className="block text-white text-sm font-medium mb-1"
                >
                  IAM Access ID
                </label>
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
                <label
                  htmlFor="secret-key"
                  className="block text-white text-sm font-medium mb-1"
                >
                  IAM Secret Access Key
                </label>
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

          {(cloudProvider === "Azure" || cloudProvider === "MinIO") && (
            <div>
              <label
                htmlFor="connection-string"
                className="block text-white text-sm font-medium mb-1"
              >
                IAM Connection String
              </label>
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
  );
};

export default DataInputField;