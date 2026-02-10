import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryEntity } from './memories.entity';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectRepository(MemoryEntity)
    private readonly repo: Repository<MemoryEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
