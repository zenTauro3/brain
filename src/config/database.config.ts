import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Memory } from '@/modules/brain/entities/memory.entity';
import { User } from '@/modules/users/user.entity';
import { Embedding } from '@/modules/brain/entities/embedding.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'brain',
  entities: [Memory, User, Embedding],
  synchronize: false,
};
