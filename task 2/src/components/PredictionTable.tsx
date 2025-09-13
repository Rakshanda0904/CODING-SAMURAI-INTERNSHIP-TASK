import React from 'react';
import { PredictionResult } from '../types/stock';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PredictionTableProps {
  predictions: PredictionResult[];
  modelName: string;
}

export const PredictionTable: React.FC<PredictionTableProps> = ({ predictions, modelName }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        {modelName} Predictions
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-700/50 text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Date</th>
              <th scope="col" className="px-6 py-3">Predicted Price</th>
              <th scope="col" className="px-6 py-3">Confidence</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">Trend</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => {
              const prevPrediction = index > 0 ? predictions[index - 1] : null;
              const trend = prevPrediction 
                ? prediction.predicted > prevPrediction.predicted ? 'up' : 'down'
                : 'neutral';
              
              return (
                <tr key={prediction.date} className="bg-gray-700/20 border-b border-gray-600 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {new Date(prediction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ${prediction.predicted.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-16 bg-gray-600 rounded-full h-2"
                      >
                        <div 
                          className={`h-2 rounded-full ${
                            prediction.confidence > 0.8 ? 'bg-green-400' :
                            prediction.confidence > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-300 text-xs">
                        {(prediction.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {trend === 'neutral' && <Activity className="w-4 h-4 text-gray-400" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};