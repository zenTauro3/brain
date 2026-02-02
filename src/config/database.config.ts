import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FactEntity } from '../modules/facts/facts.entity';
import { MemoryEntity } from '../modules/memories/memories.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'jaume',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'brain',
  entities: [FactEntity, MemoryEntity],
};
