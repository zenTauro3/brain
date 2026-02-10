import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeliefEntity } from './beliefs.entity';

@Injectable()
export class BeliefsService {
  constructor(
    @InjectRepository(BeliefEntity)
    private readonly repo: Repository<BeliefEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
