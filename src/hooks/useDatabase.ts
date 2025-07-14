// Database hook - currently using mock implementation
// Switch to useSQLiteDatabase.ts when development build is ready

export * from './useMockDatabase';

// For future development build, uncomment this and comment out mock export:
// export * from './useSQLiteDatabase';