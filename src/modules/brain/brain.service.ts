import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { Memory } from '@modules/brain/entities/memory.entity';
import { Embedding } from '@modules/brain/entities/embedding.entity';
import { NewKnowledgeSchema, NewKnowledgeType } from './schemas/extraction.schema';
import { ANSWER_SYSTEM_PROMPT, EXTRACTION_SYSTEM_PROMPT } from './brain.constants';

@Injectable()
export class BrainService {
  private openai: OpenAI;
  private readonly logger = new Logger(BrainService.name);

  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepo: Repository<Memory>,
    @InjectRepository(Embedding)
    private readonly embeddingRepo: Repository<Embedding>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async getFormattedKnowledge(userId: string, userMessage: string): Promise<string> {
    try {
      const queryVector = await this.createEmbedding(userMessage);
      const vectorStr = `[${queryVector.join(',')}]`;

      const memories = await this.memoryRepo.query(
        `
        SELECT m.* FROM memories m
        INNER JOIN embeddings e ON e.memory_id = m.id
        WHERE m.user_id = $1
        ORDER BY e.vector <=> $2
        LIMIT 10
      `,
        [userId, vectorStr],
      );

      if (!memories || memories.length === 0) {
        return 'No hay información previa relevante sobre este usuario.';
      }

      return memories
        .map((m: any) => `[${m.category}] ${m.key}: ${JSON.stringify(m.value)}`)
        .join('\n');
    } catch (err) {
      this.logger.error('Error fetching semantic knowledge', err);
      return 'Error al recuperar conocimientos previos.';
    }
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

  async generateAndSaveKnowledge(
    userId: string,
    message: string,
    userKnowledge: string,
  ): Promise<void> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: zodResponseFormat(NewKnowledgeSchema, 'NewKnowledge'),
        messages: [
          {
            role: 'system',
            content: EXTRACTION_SYSTEM_PROMPT.replace('{{userKnowledge}}', userKnowledge).replace(
              '{{currentDate}}',
              new Date().toISOString(),
            ),
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
      let finalValue = mem.value;
      if (typeof finalValue === 'string') {
        try {
          finalValue = JSON.parse(finalValue);
        } catch {
          finalValue = { raw: mem.value };
        }
      }

      await this.memoryRepo.upsert(
        {
          userId,
          key: mem.key,
          value: finalValue,
          category: mem.category,
          importanceScore: mem.importance_score,
          updatedAt: new Date(),
        },
        ['userId', 'key'],
      );

      const savedMemory = await this.memoryRepo.findOne({
        where: { userId, key: mem.key },
      });

      if (savedMemory) {
        const textToEmbed = `${mem.key}: ${JSON.stringify(finalValue)}`;
        const vector = await this.createEmbedding(textToEmbed);

        await this.embeddingRepo.upsert(
          {
            userId: userId,
            memoryId: savedMemory.id,
            vector: vector,
          },
          ['memoryId'],
        );
      }
    }
  }
}
