// Database service - currently using mock implementation
// Switch to sqlite.ts when development build is ready

export * from './mock';
export * from './schema';

// For future development build, uncomment this and comment out mock export:
// export * from './sqlite';