import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmbeddingEntity } from './embeddings.entity';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingsService {
  constructor(
    @InjectRepository(EmbeddingEntity)
    private readonly embeddingRepository: Repository<EmbeddingEntity>,

    @Inject('OPENAI_CLIENT')
    private readonly openai: OpenAI,
  ) {}

  async createEmbedding(message: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    return response.data[0].embedding;
  }

  async saveEmbedding(
    userId: number,
    vector: number[],
    sourceType: string,
    sourceId?: number,
  ): Promise<EmbeddingEntity> {
    const embedding = this.embeddingRepository.create({
      userId,
      vector,
      sourceType,
      sourceId,
    });
    return this.embeddingRepository.save(embedding);
  }

  async searchEmbeddings(userId: number, vector: number[], topK = 5): Promise<EmbeddingEntity[]> {
    return this.embeddingRepository
      .createQueryBuilder('e')
      .where('e.user_id = :userId', { userId })
      .andWhere('e.source_id IS NOT NULL')
      .orderBy('e.vector <-> :vector', 'ASC')
      .setParameter('vector', vector)
      .limit(topK)
      .getMany();
  }
}
