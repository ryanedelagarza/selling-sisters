/**
 * Hook for uploading images
 */

import { useState, useCallback } from 'react';
import { uploadImage, ApiError } from '../lib/api';

interface UseImageUploadResult {
  upload: (file: File) => Promise<string | null>;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for handling image uploads with loading state
 */
export function useImageUpload(): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.url;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : "We couldn't upload your photo. Please try again.";
      
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    error,
    reset,
  };
}
