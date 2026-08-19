import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL,
  },
};
