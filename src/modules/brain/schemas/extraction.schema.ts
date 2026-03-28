import { z } from 'zod';
import { MemoryCategory } from '../entities/memory.entity';

export const NewKnowledgeSchema = z.object({
  memories: z.array(
    z.object({
      category: z.nativeEnum(MemoryCategory),
      key: z.string().describe('Snake_case identifier. For EVENTs, use specific names like "trip_paris". For FACTs, use broad terms like "hobbies"'),
      value: z.string().describe('A natural language paragraph detailing the memory.'),
      importance_score: z.number().min(0).max(1),
    }),
  ),
});

export type NewKnowledgeType = z.infer<typeof NewKnowledgeSchema>;