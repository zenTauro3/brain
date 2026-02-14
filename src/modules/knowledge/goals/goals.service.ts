import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalEntity } from './goals.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly repo: Repository<GoalEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
