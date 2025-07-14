import { useEffect, useState } from 'react';
import { initMockDatabase, closeMockDatabase, MockDatabase } from '@/src/services/database/mock';

export const useMockDatabase = () => {
  const [database, setDatabase] = useState<MockDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setIsLoading(true);
        const db = await initMockDatabase();
        
        if (isMounted) {
          setDatabase(db);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Mock database initialization failed');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const cleanup = async () => {
    try {
      await closeMockDatabase();
      setDatabase(null);
    } catch (err) {
      console.error('Mock database cleanup failed:', err);
    }
  };

  return {
    database,
    isLoading,
    error,
    cleanup,
  };
};