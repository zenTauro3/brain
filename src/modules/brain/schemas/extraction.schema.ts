import { z } from 'zod';
import { MemoryCategory } from '../entities/memory.entity';

export const NewKnowledgeSchema = z.object({
  memories: z.array(
    z.object({
      category: z.nativeEnum(MemoryCategory),
      key: z.string().describe('snake_case identifer. Ej: "job_title", "coffee_preference"'),
      value: z.record(z.string(), z.any()).describe('JSON object with the data'),
      importance_score: z.number().min(0).max(1),
    }),
  ),
});

export type NewKnowledgeType = z.infer<typeof NewKnowledgeSchema>;
