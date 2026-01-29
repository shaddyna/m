// lib/dbConnect.ts
import mongoose from 'mongoose';
import { config } from './config';

const { MONGO_URI } = config;

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.mongoose.conn) {
    console.log('[DB] Using cached MongoDB connection');
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    console.log('[DB] Connecting to MongoDB...');
    cached.mongoose.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('[DB] Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;
  } catch (e) {
    cached.mongoose.promise = null;
    console.error('[DB] MongoDB connection error:', e);
    throw e;
  }

  return cached.mongoose.conn;
}

export default dbConnect;