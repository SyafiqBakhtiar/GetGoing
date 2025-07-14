import { useEffect, useState } from 'react';
import { initDatabase, closeDatabase } from '@/src/services/database';
import * as SQLite from 'expo-sqlite';

export const useDatabase = () => {
  const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setIsLoading(true);
        const db = await initDatabase();
        
        if (isMounted) {
          setDatabase(db);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Database initialization failed');
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
      // Don't close database here as it might be used by other components
    };
  }, []);

  const cleanup = async () => {
    try {
      await closeDatabase();
      setDatabase(null);
    } catch (err) {
      console.error('Database cleanup failed:', err);
    }
  };

  return {
    database,
    isLoading,
    error,
    cleanup,
  };
};