import { StockData } from '../types/stock';

// Simulate realistic stock data with trends, seasonality, and noise
export class StockDataService {
  private generateStockData(symbol: string, days: number): StockData[] {
    const data: StockData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    let basePrice = this.getBasePriceForSymbol(symbol);
    let trend = 0.001; // Small upward trend
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Add seasonal patterns (weekly and monthly cycles)
      const dayOfWeek = date.getDay();
      const dayOfMonth = date.getDate();
      const seasonalFactor = Math.sin(dayOfWeek * Math.PI / 3) * 0.02 + 
                           Math.sin(dayOfMonth * Math.PI / 15) * 0.01;
      
      // Add random walk with trend
      const randomChange = (Math.random() - 0.5) * 0.04;
      basePrice *= (1 + trend + seasonalFactor + randomChange);
      
      // Ensure realistic price movements
      const volatility = basePrice * 0.02;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = basePrice + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume
      });
      
      // Adjust trend slightly
      trend += (Math.random() - 0.5) * 0.0001;
    }
    
    return data;
  }
  
  private getBasePriceForSymbol(symbol: string): number {
    const prices: Record<string, number> = {
      'AAPL': 180,
      'GOOGL': 140,
      'MSFT': 380,
      'TSLA': 250,
      'AMZN': 145,
      'NVDA': 480,
      'META': 320,
      'NFLX': 400
    };
    return prices[symbol] || 100;
  }
  
  async fetchStockData(symbol: string, period: number = 365): Promise<StockData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.generateStockData(symbol, period);
  }
  
  getAvailableSymbols(): { symbol: string; name: string }[] {
    return [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'TSLA', name: 'Tesla, Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'META', name: 'Meta Platforms, Inc.' },
      { symbol: 'NFLX', name: 'Netflix, Inc.' }
    ];
  }
}

export const stockDataService = new StockDataService();