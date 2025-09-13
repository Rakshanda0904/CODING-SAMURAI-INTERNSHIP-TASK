export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionResult {
  date: string;
  actual: number;
  predicted: number;
  confidence: number;
}

export interface ModelMetrics {
  mse: number;
  mae: number;
  rmse: number;
  mape: number;
  accuracy: number;
}

export interface ModelState {
  isTraining: boolean;
  progress: number;
  metrics: ModelMetrics | null;
  predictions: PredictionResult[];
}