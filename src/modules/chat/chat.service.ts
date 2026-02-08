import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { FactService } from '../facts/facts.service';
import { MemoryService } from '../memories/memories.service';
import { Fact, Memory } from './chat.types';
import { ASK_SYSTEM_PROMPT, ASK_USER_PROMPT } from './chat.constants';

@Injectable()
export class ChatService {
  constructor(
    private factService: FactService,
    private memoryService: MemoryService,
  ) {}

  private readonly logger = new Logger(ChatService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  async createEmbedding(message: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    return response.data[0].embedding;
  }

  async generateAnswer(
    message: string,
    facts: Fact[],
    memories: Memory[],
  ): Promise<{ answer: string; newFacts: Fact[] | null; newMemories: Memory[] | null }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 600,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: ASK_SYSTEM_PROMPT },
          { role: 'user', content: ASK_USER_PROMPT(facts, memories, message) },
        ],
      });

      const raw = completion.choices[0].message?.content ?? '{}';
      return JSON.parse(raw);
    } catch (err) {
      this.logger.warn('Invalid JSON from LLM: ' + err);
      return { answer: '', newFacts: null, newMemories: null };
    }
  }

  async saveFact(userId: string, fact: Fact) {
    return this.factService.saveFact({ ...fact, userId });
  }

  async findFacts(userId: string): Promise<Fact[]> {
    return this.factService.findFacts(userId);
  }

  async saveMemory(userId: string, memory: Memory) {
    return this.memoryService.saveMemory({ ...memory, userId });
  }

  async findMemories(userId: string, embedding: number[]): Promise<Memory[]> {
    return this.memoryService.findRelevantMemories(userId, embedding);
  }
}
