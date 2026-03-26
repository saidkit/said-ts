// Test setup — preloaded by bunfig.toml
// Add global test helpers here

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./prisma/test.db";
process.env.JWT_SECRET = "test-secret";
process.env.LOG_LEVEL = "error";
