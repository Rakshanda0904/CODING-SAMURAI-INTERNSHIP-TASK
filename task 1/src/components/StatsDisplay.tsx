import React from 'react';
import { Image, Clock, Target, Zap } from 'lucide-react';

interface StatsDisplayProps {
  totalImages: number;
  totalCaptions: number;
  averageConfidence: number;
  processingTime: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  totalImages,
  totalCaptions,
  averageConfidence,
  processingTime,
}) => {
  const stats = [
    {
      label: 'Images Processed',
      value: totalImages,
      icon: Image,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100/10',
    },
    {
      label: 'Captions Generated',
      value: totalCaptions,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100/10',
    },
    {
      label: 'Avg Confidence',
      value: `${Math.round(averageConfidence * 100)}%`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-100/10',
    },
    {
      label: 'Processing Time',
      value: `${processingTime.toFixed(1)}s`,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <p className="text-xl font-semibold text-white">{stat.value}</p>
          <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

