import React, { useEffect } from 'react';
import { Server, AlertCircle, CheckCircle, Cpu, Brain } from 'lucide-react';

interface ServerStatusProps {
  serverStatus: {
    isRunning: boolean;
    device?: string;
    modelsLoaded?: number;
  };
  onCheckStatus: () => Promise<boolean>;
}

export const ServerStatus: React.FC<ServerStatusProps> = ({
  serverStatus,
  onCheckStatus,
}) => {
  useEffect(() => {
    onCheckStatus();
    const interval = setInterval(onCheckStatus, 10000);
    return () => clearInterval(interval);
  }, [onCheckStatus]);

  if (serverStatus.isRunning) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6 shadow-md shadow-green-500/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-400 text-lg">AI Server Online</h3>
            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Cpu className="w-4 h-4 text-green-400" />
                <span>Device: {serverStatus.device || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4 text-green-400" />
                <span>Models: {serverStatus.modelsLoaded || 0} loaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6 shadow-md shadow-red-500/10">
      <div className="flex items-start space-x-4">
        <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-full">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-400 text-lg mb-2">AI Server Offline</h3>
          <p className="text-gray-300 mb-4">
            The Python backend server is not running. Start it to enable AI-powered caption generation.
          </p>

          <div className="bg-gray-900 rounded-lg p-4 mb-5 border border-gray-700">
            <h4 className="font-medium text-red-300 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>
                Install dependencies: <code className="bg-gray-700 px-1 rounded font-mono text-red-300">pip install -r requirements.txt</code>
              </li>
              <li>
                Start server: <code className="bg-gray-700 px-1 rounded font-mono text-red-300">python backend/main.py</code>
              </li>
              <li>Wait for models to load (may take a few minutes)</li>
              <li>
                Server URL: <code className="bg-gray-700 px-1 rounded font-mono text-red-300">http://localhost:8000</code>
              </li>
            </ol>
          </div>

          <button
            onClick={onCheckStatus}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-red-500/30"
          >
            <Server className="w-4 h-4" />
            <span>Check Server Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
