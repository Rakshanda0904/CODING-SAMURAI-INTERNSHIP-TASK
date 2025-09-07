import { useState, useCallback } from 'react';
import { CaptionService } from '../services/captionService';

interface Caption {
  id: string;
  text: string;
  confidence: number;
  style: string;
  model: string;
  timestamp: Date;
}

interface Stats {
  totalImages: number;
  totalCaptions: number;
  averageConfidence: number;
  processingTime: number;
  imageSize?: string;
}

export const useImageCaption = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    isRunning: boolean;
    device?: string;
    modelsLoaded?: number;
  }>({ isRunning: false });
  const [stats, setStats] = useState<Stats>({
    totalImages: 0,
    totalCaptions: 0,
    averageConfidence: 0,
    processingTime: 0,
  });

  const checkServerStatus = useCallback(async () => {
    try {
      const status = await CaptionService.checkServerStatus();
      setServerStatus(status);
      return status.isRunning;
    } catch (error) {
      setServerStatus({ isRunning: false });
      return false;
    }
  }, []);

  const generateCaptions = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await CaptionService.generateCaptions(imageFile);
      setCaptions(result.captions);
      
      const averageConfidence = result.captions.reduce((sum, caption) => sum + caption.confidence, 0) / result.captions.length;
      
      setStats(prevStats => ({
        totalImages: prevStats.totalImages + 1,
        totalCaptions: prevStats.totalCaptions + result.captions.length,
        averageConfidence,
        processingTime: result.stats.processing_time,
        imageSize: result.stats.image_size,
      }));
      
      // Update server status on successful request
      setServerStatus({ isRunning: true });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate captions';
      setError(errorMessage);
      
      // Check if it's a server connectivity issue
      if (errorMessage.includes('server') || errorMessage.includes('backend')) {
        setServerStatus({ isRunning: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSingleCaption = useCallback(async (imageFile: File, style: string = 'descriptive') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const caption = await CaptionService.generateSingleCaption(imageFile, style);
      setCaptions([caption]);
      
      setStats(prevStats => ({
        ...prevStats,
        totalImages: prevStats.totalImages + 1,
        totalCaptions: prevStats.totalCaptions + 1,
        averageConfidence: caption.confidence,
        processingTime: 0, // Single caption doesn't return processing time
      }));
      
      setServerStatus({ isRunning: true });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate caption';
      setError(errorMessage);
      
      if (errorMessage.includes('server') || errorMessage.includes('backend')) {
        setServerStatus({ isRunning: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCaptions = useCallback(() => {
    setCaptions([]);
    setError(null);
  }, []);

  return {
    captions,
    isLoading,
    error,
    stats,
    serverStatus,
    generateCaptions,
    generateSingleCaption,
    clearCaptions,
    checkServerStatus,
  };
};