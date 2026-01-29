// lib/config.ts (or app/api/config.ts)
export const config = {
  PORT: process.env.PORT || 3000, // Next.js default is 3000
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  CORS_OPTIONS: { origin: '*' },
  BODY_LIMIT: '10mb',
  MAX_TOKENS: 5,
} as const;

// Validation helper
export function validateConfig() {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  console.log('[CONFIG] Configuration loaded successfully');
}