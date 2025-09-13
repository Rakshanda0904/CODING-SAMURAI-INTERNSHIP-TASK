import * as tf from '@tensorflow/tfjs';
import { StockData, PredictionResult, ModelMetrics } from '../types/stock';

export class LinearRegressionModel {
  private model: tf.Sequential | null = null;
  
  prepareData(data: StockData[], lookback: number = 10) {
    const prices = data.map(d => d.close);
    const features: number[][] = [];
    const labels: number[] = [];
    
    for (let i = lookback; i < prices.length; i++) {
      const sequence = prices.slice(i - lookback, i);
      features.push(sequence);
      labels.push(prices[i]);
    }
    
    return {
      X: tf.tensor2d(features),
      y: tf.tensor1d(labels)
    };
  }
  
  async trainModel(data: StockData[], onProgress?: (progress: number) => void): Promise<void> {
    const { X, y } = this.prepareData(data);
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });
    
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    await this.model.fit(X, y, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (onProgress) {
            onProgress(((epoch + 1) / 100) * 100);
          }
        }
      }
    });
    
    X.dispose();
    y.dispose();
  }
  
  async predict(data: StockData[], steps: number = 5): Promise<PredictionResult[]> {
    if (!this.model) throw new Error('Model not trained');
    
    const prices = data.map(d => d.close);
    const lastSequence = prices.slice(-10);
    const predictions: PredictionResult[] = [];
    
    let currentSequence = [...lastSequence];
    const lastDate = new Date(data[data.length - 1].date);
    
    for (let i = 0; i < steps; i++) {
      const input = tf.tensor2d([currentSequence]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const predValue = await prediction.data();
      
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        actual: 0, // Future value, unknown
        predicted: Math.round(predValue[0] * 100) / 100,
        confidence: 0.7 + Math.random() * 0.2 // Simulated confidence
      });
      
      // Update sequence for next prediction
      currentSequence = [...currentSequence.slice(1), predValue[0]];
      
      input.dispose();
      prediction.dispose();
    }
    
    return predictions;
  }
  
  calculateMetrics(actual: number[], predicted: number[]): ModelMetrics {
    const n = actual.length;
    let mse = 0, mae = 0, mape = 0;
    
    for (let i = 0; i < n; i++) {
      const error = actual[i] - predicted[i];
      mse += error * error;
      mae += Math.abs(error);
      mape += Math.abs(error / actual[i]);
    }
    
    mse /= n;
    mae /= n;
    mape = (mape / n) * 100;
    const rmse = Math.sqrt(mse);
    
    // Simple accuracy based on direction prediction
    let correctDirection = 0;
    for (let i = 1; i < n; i++) {
      const actualDir = actual[i] > actual[i-1];
      const predDir = predicted[i] > predicted[i-1];
      if (actualDir === predDir) correctDirection++;
    }
    const accuracy = (correctDirection / (n - 1)) * 100;
    
    return { mse, mae, rmse, mape, accuracy };
  }
}

export class SimpleNeuralNetwork {
  private model: tf.Sequential | null = null;
  
  prepareData(data: StockData[], lookback: number = 20) {
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    // Normalize data
    const priceMax = Math.max(...prices);
    const priceMin = Math.min(...prices);
    const volMax = Math.max(...volumes);
    const volMin = Math.min(...volumes);
    
    const normalizedPrices = prices.map(p => (p - priceMin) / (priceMax - priceMin));
    const normalizedVolumes = volumes.map(v => (v - volMin) / (volMax - volMin));
    
    const features: number[][] = [];
    const labels: number[] = [];
    
    for (let i = lookback; i < prices.length; i++) {
      const priceSeq = normalizedPrices.slice(i - lookback, i);
      const volSeq = normalizedVolumes.slice(i - lookback, i);
      
      // Combine price and volume features
      const combined = [];
      for (let j = 0; j < lookback; j++) {
        combined.push(priceSeq[j], volSeq[j]);
      }
      
      features.push(combined);
      labels.push(normalizedPrices[i]);
    }
    
    return {
      X: tf.tensor2d(features),
      y: tf.tensor1d(labels),
      priceRange: { min: priceMin, max: priceMax },
      volRange: { min: volMin, max: volMax }
    };
  }
  
  async trainModel(data: StockData[], onProgress?: (progress: number) => void): Promise<void> {
    const { X, y } = this.prepareData(data);
    
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [40], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });
    
    this.model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    await this.model.fit(X, y, {
      epochs: 150,
      batchSize: 16,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (onProgress) {
            onProgress(((epoch + 1) / 150) * 100);
          }
        }
      }
    });
    
    X.dispose();
    y.dispose();
  }
  
  async predict(data: StockData[], steps: number = 5): Promise<PredictionResult[]> {
    if (!this.model) throw new Error('Model not trained');
    
    const { priceRange, volRange } = this.prepareData(data);
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    // Normalize latest data
    const normalizedPrices = prices.map(p => (p - priceRange.min) / (priceRange.max - priceRange.min));
    const normalizedVolumes = volumes.map(v => (v - volRange.min) / (volRange.max - volRange.min));
    
    const predictions: PredictionResult[] = [];
    const lastDate = new Date(data[data.length - 1].date);
    
    let currentPriceSeq = normalizedPrices.slice(-20);
    let currentVolSeq = normalizedVolumes.slice(-20);
    
    for (let i = 0; i < steps; i++) {
      const combined = [];
      for (let j = 0; j < 20; j++) {
        combined.push(currentPriceSeq[j], currentVolSeq[j]);
      }
      
      const input = tf.tensor2d([combined]);
      const prediction = this.model.predict(input) as tf.Tensor;
      const predValue = await prediction.data();
      
      // Denormalize prediction
      const actualPrice = predValue[0] * (priceRange.max - priceRange.min) + priceRange.min;
      
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        actual: 0,
        predicted: Math.round(actualPrice * 100) / 100,
        confidence: 0.6 + Math.random() * 0.3
      });
      
      // Update sequences
      currentPriceSeq = [...currentPriceSeq.slice(1), predValue[0]];
      currentVolSeq = [...currentVolSeq.slice(1), 0.5]; // Assume average volume
      
      input.dispose();
      prediction.dispose();
    }
    
    return predictions;
  }
}