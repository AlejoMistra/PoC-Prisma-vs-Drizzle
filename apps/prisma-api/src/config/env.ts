import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const requiredVars = ['PRISMA_DATABASE_URL'];

for (const name of requiredVars) {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
}

export const env = {
  port: Number(process.env.PRISMA_API_PORT ?? 3001),
  databaseUrl: process.env.PRISMA_DATABASE_URL!
};
