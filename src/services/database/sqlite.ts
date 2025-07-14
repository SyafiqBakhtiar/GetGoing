import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';

const DATABASE_NAME = 'getgoing.db';

let database: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (database) {
    return database;
  }

  try {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Enable foreign keys
    await database.execAsync('PRAGMA foreign_keys = ON;');
    
    // Create tables
    await database.execAsync(createTables);
    
    console.log('Database initialized successfully');
    return database;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!database) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.closeAsync();
    database = null;
  }
};

// Database operations helper
export const executeQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  const db = getDatabase();
  try {
    const result = await db.getAllAsync(query, params);
    return result as T[];
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
};

export const executeUpdate = async (
  query: string,
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> => {
  const db = getDatabase();
  try {
    const result = await db.runAsync(query, params);
    return result;
  } catch (error) {
    console.error('Update execution failed:', error);
    throw error;
  }
};

export const executeTransaction = async (
  operations: Array<{ query: string; params?: any[] }>
): Promise<void> => {
  const db = getDatabase();
  try {
    await db.withTransactionAsync(async () => {
      for (const operation of operations) {
        await db.runAsync(operation.query, operation.params || []);
      }
    });
  } catch (error) {
    console.error('Transaction execution failed:', error);
    throw error;
  }
};

export * from './schema';