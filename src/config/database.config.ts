import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FactEntity } from '../modules/knowledge/facts/facts.entity';
import { MemoryEntity } from '../modules/knowledge/memories/memories.entity';
import { BeliefEntity } from '../modules/knowledge/beliefs/beliefs.entity';
import { EmotionalStateEntity } from '../modules/knowledge/emotional_state/emotional_state.entity';
import { EmbeddingEntity } from '../modules/knowledge/embeddings/embeddings.entity';
import { GoalEntity } from '../modules/knowledge/goals/goals.entity';
import { HabitEntity } from '../modules/knowledge/habits/habits.entity';
import { PreferenceEntity } from '../modules/knowledge/preferences/preferences.entity';
import { RelationshipEntity } from '../modules/knowledge/relationships/relationships.entity';
import { TraitEntity } from '../modules/knowledge/traits/traits.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'jaume',
  password: process.env.DB_PASSWORD ?? '1234',
  database: process.env.DB_NAME ?? 'brain',
  entities: [
    FactEntity,
    MemoryEntity,
    BeliefEntity,
    EmbeddingEntity,
    EmotionalStateEntity,
    GoalEntity,
    HabitEntity,
    PreferenceEntity,
    RelationshipEntity,
    TraitEntity,
  ],
};
