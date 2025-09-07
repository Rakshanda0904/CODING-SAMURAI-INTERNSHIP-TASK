import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-md shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-700/20 to-blue-700/20 hover:from-purple-700/30 hover:to-blue-700/30 transition-all duration-300">
              <Brain className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                AI Caption Generator
              </h1>
              <p className="text-gray-400 text-sm">
                Smart Image Descriptions in Seconds
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 text-purple-400 bg-gray-800/50 px-3 py-1 rounded-full hover:bg-gray-700/70 transition-all duration-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">AI-Powered</span>
          </div>
        </div>
      </div>
    </header>
  );
};
