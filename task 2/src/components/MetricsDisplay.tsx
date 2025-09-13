import React from 'react';
import { ModelMetrics } from '../types/stock';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: ModelMetrics;
  modelName: string;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, modelName }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-400" />
        {modelName} Performance
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-gray-300">RMSE</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${metrics.rmse.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-300">MAE</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${metrics.mae.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics.accuracy.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">MAPE</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics.mape.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};