import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { StockData, PredictionResult } from '../types/stock';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  stockData: StockData[];
  predictions: PredictionResult[];
  title: string;
}

export const StockChart: React.FC<StockChartProps> = ({ stockData, predictions, title }) => {
  const historicalData = {
    labels: stockData.map(d => d.date),
    datasets: [
      {
        label: 'Historical Prices',
        data: stockData.map(d => d.close),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      }
    ]
  };

  const predictionData = {
    labels: [...stockData.slice(-30).map(d => d.date), ...predictions.map(p => p.date)],
    datasets: [
      {
        label: 'Historical Prices',
        data: [...stockData.slice(-30).map(d => d.close), ...Array(predictions.length).fill(null)],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Predictions',
        data: [...Array(30).fill(null), ...predictions.map(p => p.predicted)],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb'
        }
      },
      title: {
        display: true,
        text: title,
        color: '#f3f4f6',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    }
  };

  return (
    <div className="h-96 w-full">
      <Line data={predictions.length > 0 ? predictionData : historicalData} options={options} />
    </div>
  );
};