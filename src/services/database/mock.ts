// Mock database service for development without native modules
// This replaces SQLite functionality temporarily until development build is ready

export interface MockDatabase {
  isInitialized: boolean;
}

let mockDatabase: MockDatabase | null = null;

export const initMockDatabase = async (): Promise<MockDatabase> => {
  if (mockDatabase) {
    return mockDatabase;
  }

  // Simulate database initialization delay
  await new Promise(resolve => setTimeout(resolve, 100));

  mockDatabase = {
    isInitialized: true,
  };

  console.log('Mock database initialized successfully');
  return mockDatabase;
};

export const getMockDatabase = (): MockDatabase => {
  if (!mockDatabase) {
    throw new Error('Mock database not initialized. Call initMockDatabase() first.');
  }
  return mockDatabase;
};

export const closeMockDatabase = async (): Promise<void> => {
  if (mockDatabase) {
    mockDatabase = null;
  }
};

// Mock database operations
export const executeMockQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  console.log('Mock query executed:', query, params);
  // Return empty array for now
  return [];
};

export const executeMockUpdate = async (
  query: string,
  params: any[] = []
): Promise<{ changes: number; insertId?: number }> => {
  console.log('Mock update executed:', query, params);
  // Return mock result
  return { changes: 1, insertId: 1 };
};

export const executeMockTransaction = async (
  operations: Array<{ query: string; params?: any[] }>
): Promise<void> => {
  console.log('Mock transaction executed:', operations);
  // Simulate transaction
  await new Promise(resolve => setTimeout(resolve, 50));
};