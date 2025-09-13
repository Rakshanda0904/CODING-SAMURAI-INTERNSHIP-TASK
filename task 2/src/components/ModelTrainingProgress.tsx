import React from 'react';
import { Brain, Zap } from 'lucide-react';

interface ModelTrainingProgressProps {
  isTraining: boolean;
  progress: number;
  modelName: string;
}

export const ModelTrainingProgress: React.FC<ModelTrainingProgressProps> = ({
  isTraining,
  progress,
  modelName
}) => {
  if (!isTraining) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Brain className="w-6 h-6 text-blue-400" />
          <Zap className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Training {modelName}...
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-400">
          Training neural network on historical stock data...
        </p>
      </div>
    </div>
  );
};