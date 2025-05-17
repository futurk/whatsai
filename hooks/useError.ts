import { useState, useCallback } from 'react';

interface ErrorState {
  message: string | null;
  code?: string;
}

export function useError() {
  const [error, setError] = useState<ErrorState>({ message: null });

  const handleError = useCallback((error: Error | string, code?: string) => {
    const message = error instanceof Error ? error.message : error;
    setError({ message, code });
  }, []);

  const clearError = useCallback(() => {
    setError({ message: null });
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}