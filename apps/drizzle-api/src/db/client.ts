import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../config/env.js';
import * as schema from './schema.js';

export const db = drizzle({
  connection: env.databaseUrl,
  schema
});
