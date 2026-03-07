import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { Memory } from '@modules/brain/entities/memory.entity';
import { NewKnowledgeSchema, NewKnowledgeType } from './schemas/extraction.schema';
import { ANSWER_SYSTEM_PROMPT, EXTRACTION_SYSTEM_PROMPT } from './brain.constants';

@Injectable()
export class BrainService {
  private openai: OpenAI;
  private readonly logger = new Logger(BrainService.name);

  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepo: Repository<Memory>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getFormattedKnowledge(userId: string): Promise<string> {
    const memories = await this.memoryRepo.find({
      where: { userId },
      order: { importanceScore: 'DESC' },
      take: 20,
    });

    if (memories.length === 0) {
      return 'No hay información previa sobre este usuario.';
    }

    return memories
      .map((m) => `[${m.category}] ${m.key}: ${JSON.stringify(m.value)}`)
      .join('\n');
  }

  async generateAnswer(message: string, userKnowledge: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: ANSWER_SYSTEM_PROMPT.replace('{{userKnowledge}}', userKnowledge),
          },
          { role: 'user', content: message },
        ],
      });
      return completion.choices[0].message?.content ?? '';
    } catch (err) {
      this.logger.error('Error generating answer', err);
      return 'Lo siento, tuve un problema al procesar tu mensaje.';
    }
  }

  async generateAndSaveKnowledge(userId: string, message: string, userKnowledge: string): Promise<void> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: zodResponseFormat(NewKnowledgeSchema, 'NewKnowledge'),
        messages: [
          {
            role: 'system',
            content: EXTRACTION_SYSTEM_PROMPT.replace('{{userKnowledge}}', userKnowledge),
          },
          { role: 'user', content: message },
        ],
      });

      const raw = completion.choices[0].message?.content ?? '{"memories": []}';
      const parsed: NewKnowledgeType = JSON.parse(raw);

      if (parsed.memories && parsed.memories.length > 0) {
        await this.persistMemories(userId, parsed.memories);
      }
    } catch (err) {
      this.logger.error('Error at knowledge extraction or persistence.', err);
    }
  }

  private async persistMemories(userId: string, memories: any[]) {
    for (const mem of memories) {
      await this.memoryRepo.upsert(
        {
          userId,
          key: mem.key,
          value: mem.value,
          category: mem.category,
          importanceScore: mem.importance_score,
          updatedAt: new Date(),
        },
        ['userId', 'key'],
      );
    }
  }
}