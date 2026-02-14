import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactEntity } from './facts.entity';

@Injectable()
export class FactsService {
  constructor(
    @InjectRepository(FactEntity)
    private readonly repo: Repository<FactEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
