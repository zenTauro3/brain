import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Pool } from 'pg';
import { Fact, Memory } from './chat.types';
import { ASK_SYSTEM_PROMPT, ASK_USER_PROMPT } from './chat.constants';
import { dbConfig } from '../../config/database.config';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  private db = new Pool(dbConfig);

  async findFacts(userId: string): Promise<Fact[]> {
    const res = await this.db.query(`SELECT * FROM facts WHERE user_id = $1`, [userId]);
    return res.rows;
  }

  async createEmbedding(message: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    return response.data[0].embedding;
  }

  private embeddingToVector(e: number[]) {
    return '[' + e.map((n) => Number(n).toString()).join(',') + ']';
  }

  async findMemories(userId: string, embedding: number[], limit = 10): Promise<Memory[]> {
    if (!embedding || !embedding.length) return [];
    const vectorLiteral = this.embeddingToVector(embedding);
    const res = await this.db.query(
      `
      SELECT content, embedding, importance
      FROM memories
      WHERE user_id = $1 AND importance >= 1
      ORDER BY embedding <-> $2::vector
      LIMIT $3
      `,
      [userId, vectorLiteral, limit],
    );
    return res.rows.map((r) => ({
      content: r.content,
      importance: r.importance,
      embedding: r.embedding,
    }));
  }

  async generateAnswer(
    message: string,
    facts: Fact[],
    memories: Memory[],
  ): Promise<{
    answer: string;
    newFacts: Fact[] | null;
    newMemories: Memory[] | null;
  }> {
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

    try {
      return JSON.parse(raw);
    } catch (err) {
      this.logger.warn('Invalid JSON from LLM: ' + raw);
      return {
        answer: raw,
        newFacts: null,
        newMemories: null,
      };
    }
  }

  async saveMemory(userId: string, memory: Memory) {
    const embedding = await this.createEmbedding(memory.content);
    const vectorLiteral = this.embeddingToVector(embedding);
    const res = await this.db.query(
      `
      INSERT INTO memories (user_id, content, embedding, importance)
      VALUES ($1, $2, ${vectorLiteral ? '$3::vector' : 'NULL'}, $4)
      RETURNING id, user_id, content, importance, created_at, updated_at
      `,
      [userId, memory.content, vectorLiteral, memory.importance],
    );
    return res.rows[0];
  }
}
