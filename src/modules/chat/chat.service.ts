import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Pool } from 'pg';
import { ExtractedNLU, Fact, Memory } from './chat.types';
import { ASK_PROMPT } from './chat.constants';

@Injectable()
export class ChatService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  private db = new Pool({ connectionString: process.env.DATABASE_URL });

  async extractNLU(message: string): Promise<ExtractedNLU> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 120,
      messages: [
        { role: 'system', content: 'You are a deterministic NLU extractor.' },
        { role: 'user', content: message },
      ],
    });
    return JSON.parse(completion.choices[0].message.content!);
  }

  async findFacts(userId: string, entities: { type: string; value: string }[]): Promise<Fact[]> {
    if (!entities?.length) return [];
    const values = entities.map(e => `%${e.value}%`);
    const res = await this.db.query(
      `
      SELECT key, value, confidence
      FROM user_facts
      WHERE user_id = $1
        AND (key ILIKE ANY($2) OR value ILIKE ANY($2))
      ORDER BY confidence DESC
      `,
      [userId, values],
    );
    return res.rows.filter(row => row.confidence >= 0.7);
  }

  async createEmbedding(message: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    return response.data[0].embedding;
  }

  async findMemories(userId: string, embedding: number[], limit = 10): Promise<Memory[]> {
    const res = await this.db.query(
      `
      SELECT content, embedding, importance
      FROM memory_entries
      WHERE user_id = $1 AND importance >= 3
      ORDER BY embedding <-> $2
      LIMIT $3
      `,
      [userId, embedding, limit],
    );
    return res.rows.map(r => ({
      content: r.content,
      importance: r.importance,
      embedding: r.embedding,
    }));
  }

  async generateAnswer(facts: Fact[], memories: Memory[], message: string) {
    const prompt = ASK_PROMPT({ facts, memories, message });
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 400,
      messages: [{ role: 'system', content: prompt }],
    });

    // For simplicity, return text only (could later parse newFact/newMemory)
    return completion.choices[0].message?.content ?? '';
  }

  async saveFact(userId: string, fact: Fact) {
    await this.db.query(
      `
      INSERT INTO user_facts (user_id, key, value, confidence)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT(user_id, key)
      DO UPDATE SET value = EXCLUDED.value, confidence = EXCLUDED.confidence, updated_at = NOW()
      `,
      [userId, fact.key, fact.value, fact.confidence],
    );
  }

  async saveMemory(userId: string, memory: Memory) {
    await this.db.query(
      `
      INSERT INTO memory_entries (user_id, content, embedding, importance)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, memory.content, memory.embedding, memory.importance],
    );
  }
}
