import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryEntity } from './memories.entity';
import { CreateMemoryDto, UpdateMemoryDto } from './memories.types';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(MemoryEntity)
    private memoryRepo: Repository<MemoryEntity>,
  ) {}

  async saveMemory(createDto: CreateMemoryDto): Promise<MemoryEntity> {
    const entity = this.memoryRepo.create(createDto);
    return this.memoryRepo.save(entity);
  }

  async findMemories(userId: string): Promise<MemoryEntity[]> {
    return this.memoryRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findRelevantMemories(
    userId: string,
    embedding: number[],
    limit = 10,
  ): Promise<MemoryEntity[]> {
    const memories = await this.findMemories(userId);

    const similarity = (vecA: number[], vecB: number[]) => {
      const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
      const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
      const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
      return dot / (normA * normB + 1e-8);
    };

    return memories
      .map((m) => ({ ...m, score: m.embedding ? similarity(embedding, m.embedding) : 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async updateMemory(id: number, updateDto: UpdateMemoryDto): Promise<MemoryEntity | null> {
    await this.memoryRepo.update(id, updateDto);
    return this.memoryRepo.findOneBy({ id });
  }
}
