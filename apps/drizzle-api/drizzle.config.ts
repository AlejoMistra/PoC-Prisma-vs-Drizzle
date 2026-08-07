import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error('Missing DRIZZLE_DATABASE_URL in .env');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL
  }
} satisfies Config;
