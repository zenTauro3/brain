import { z } from 'zod';
import { MemoryCategory } from '../entities/memory.entity';

export const NewKnowledgeSchema = z.object({
  memories: z.array(
    z.object({
      category: z.nativeEnum(MemoryCategory),
      key: z.string().describe('snake_case identifier. Ej: "job_title", "location"'),
      value: z.string().describe('Stringified JSON con los datos. Ej: "{\\"city\\": \\"Valencia\\"}"'),
      importance_score: z.number().min(0).max(1),
    }),
  ),
});

export type NewKnowledgeType = z.infer<typeof NewKnowledgeSchema>;