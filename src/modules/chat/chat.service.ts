// chat.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Pool } from 'pg';
import { ExtractedNLU, Fact, Memory } from './chat.types';
import { ASK_PROMPT } from './chat.constants';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  private db = new Pool({ connectionString: process.env.DATABASE_URL });

  // --- NLU extraction (sin cambios)
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

  // --- findFacts (ajustado a fact_key)
  async findFacts(userId: string, entities: { type: string; value: string }[]): Promise<Fact[]> {
    if (!entities?.length) return [];
    const values = entities.map((e) => `%${e.value}%`);
    const res = await this.db.query(
      `
      SELECT fact_key AS key, value, confidence
      FROM user_facts
      WHERE user_id = $1
        AND (fact_key ILIKE ANY($2) OR value ILIKE ANY($2))
      ORDER BY confidence DESC
      `,
      [userId, values],
    );
    return res.rows
      .filter((row) => row.confidence >= 0.7)
      .map((r) => ({
        key: r.key,
        value: r.value,
        confidence: r.confidence,
      }));
  }

  // --- embeddings
  async createEmbedding(message: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    return response.data[0].embedding;
  }

  // util: convierte number[] => literal pgvector "[0.1,0.2,...]"
  private embeddingToVectorLiteral(e: number[]) {
    // evita exponencial y fuerza notación decimal simple
    return '[' + e.map((n) => Number(n).toString()).join(',') + ']';
  }

  // --- findMemories: orden por similitud usando $2::vector
  async findMemories(userId: string, embedding: number[], limit = 10): Promise<Memory[]> {
    if (!embedding || !embedding.length) return [];
    const vectorLiteral = this.embeddingToVectorLiteral(embedding);
    const res = await this.db.query(
      `
      SELECT content, embedding, importance
      FROM memory_entries
      WHERE user_id = $1 AND importance >= 3
      ORDER BY embedding <-> $2::vector
      LIMIT $3
      `,
      [userId, vectorLiteral, limit],
    );
    return res.rows.map((r) => ({
      content: r.content,
      importance: r.importance,
      // r.embedding puede venir como string; si quieres parsearlo lo hacemos aquí (opcional)
      embedding: r.embedding,
    }));
  }

  // --- generar respuesta y (opcional) newFact/newMemory desde LLM
  // El LLM debe devolver JSON con shape: { answer: string, newFact?: { key, value, confidence }, newMemory?: { content, importance } }
  async generateAnswerAndCandidates(facts: Fact[], memories: Memory[], message: string) {
    // Construimos prompt que obliga a devolver JSON
    const prompt =
      ASK_PROMPT({ facts, memories, message }) +
      `
IMPORTANT: Return a single JSON object only (no extra text) with this structure:
{
  "answer": "<the textual answer to the user>",
  "newFact": {"key":"...","value":"...","confidence":0.85} OR null,
  "newMemory": {"content":"...","importance":2} OR null
}
If no newFact or newMemory is needed return null for those fields.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 600,
      messages: [{ role: 'system', content: prompt }],
    });

    const raw = completion.choices[0].message?.content ?? '';
    // parse JSON robusto
    try {
      const parsed = JSON.parse(raw);
      return {
        answer: parsed.answer ?? '',
        newFact: parsed.newFact ?? null,
        newMemory: parsed.newMemory ?? null,
      };
    } catch (err) {
      this.logger.warn('Failed to parse LLM JSON response, returning text fallback. Raw: ' + raw);
      // fallback sencillo: devolver todo como texto en answer
      return {
        answer: raw,
        newFact: null,
        newMemory: null,
      };
    }
  }

  // --- upsertOrReturnExistingFact: comprueba existencia y solo inserta si no existía
  async upsertOrReturnExistingFact(userId: string, fact: Fact) {
    // Normalizamos la propiedad: fact.key -> fact_key column
    const key = fact.key;
    const value = fact.value;
    const confidence = fact.confidence ?? 1.0;

    // 1) comprobar si ya existe
    const existing = await this.db.query(
      `SELECT id, user_id, fact_key AS key, value, confidence, created_at, updated_at
       FROM user_facts
       WHERE user_id = $1 AND fact_key = $2
       LIMIT 1`,
      [userId, key],
    );
    if (existing.rowCount != null && existing.rowCount > 0) {
      return existing.rows[0]; // ya existía -> devolvemos
    }

    // 2) si no existe, insertamos y devolvemos la fila
    const inserted = await this.db.query(
      `INSERT INTO user_facts (user_id, fact_key, value, confidence)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, fact_key AS key, value, confidence, created_at, updated_at`,
      [userId, key, value, confidence],
    );
    return inserted.rows[0];
  }

  // --- saveMemory: inserta memoria (convierte embedding a vector literal)
  async saveMemory(userId: string, memory: Memory) {
    const vectorLit = memory.embedding ? this.embeddingToVectorLiteral(memory.embedding) : null;
    const res = await this.db.query(
      `
      INSERT INTO memory_entries (user_id, content, embedding, importance)
      VALUES ($1, $2, ${vectorLit ? '$3::vector' : 'NULL'}, $4)
      RETURNING id, user_id, content, importance, created_at, updated_at
      `,
      vectorLit
        ? [userId, memory.content, vectorLit, memory.importance]
        : [userId, memory.content, memory.importance],
    );
    return res.rows[0];
  }
}
