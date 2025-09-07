import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

interface Caption {
  id: string;
  text: string;
  confidence: number;
  style: string;
  model: string;
  timestamp: number;
}

interface CaptionResponse {
  success: boolean;
  captions: Caption[];
  stats: {
    processing_time: number;
    num_captions: number;
    average_confidence: number;
    image_size: string;
  };
}

interface SingleCaptionResponse {
  success: boolean;
  caption: Caption;
}

export class CaptionService {
  private static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }

  static async generateCaptions(imageFile: File): Promise<{
    captions: Caption[];
    stats: any;
  }> {
    try {
      // Check if server is running
      const isHealthy = await this.checkServerHealth();
      if (!isHealthy) {
        throw new Error('AI server is not available. Please ensure the Python backend is running on port 8000.');
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axios.post<CaptionResponse>(
        `${API_BASE_URL}/generate-captions`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout for AI processing
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to generate captions');
      }

      // Convert timestamp to Date objects for frontend compatibility
      const captions = response.data.captions.map(caption => ({
        ...caption,
        timestamp: new Date(caption.timestamp * 1000),
      }));

      return {
        captions,
        stats: response.data.stats,
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          throw new Error('Cannot connect to AI server. Please start the Python backend with: python backend/main.py');
        } else if (error.response?.status === 400) {
          throw new Error('Invalid image file. Please upload a valid image.');
        } else if (error.response?.status === 500) {
          throw new Error(error.response.data.detail || 'AI processing failed. Please try again.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. The image might be too large or complex.');
        }
      }
      
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  static async generateSingleCaption(imageFile: File, style: string = 'descriptive'): Promise<Caption> {
    try {
      const isHealthy = await this.checkServerHealth();
      if (!isHealthy) {
        throw new Error('AI server is not available. Please ensure the Python backend is running.');
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axios.post<SingleCaptionResponse>(
        `${API_BASE_URL}/generate-single-caption?style=${style}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 20000,
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to generate caption');
      }

      return {
        ...response.data.caption,
        timestamp: new Date(response.data.caption.timestamp * 1000),
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          throw new Error('Cannot connect to AI server. Please start the Python backend.');
        }
      }
      
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  static async checkServerStatus(): Promise<{
    isRunning: boolean;
    device?: string;
    modelsLoaded?: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
      return {
        isRunning: true,
        device: response.data.device,
        modelsLoaded: response.data.models_loaded,
      };
    } catch (error) {
      return { isRunning: false };
    }
  }
}