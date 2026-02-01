import { PoolConfig } from 'pg';

export const dbConfig: PoolConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'jaume',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'brain',
};

