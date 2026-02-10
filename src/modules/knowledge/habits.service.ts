import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habits.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly repo: Repository<HabitEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
