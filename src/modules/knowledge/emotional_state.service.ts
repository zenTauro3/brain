import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionalStateEntity } from './emotional_state.entity';

@Injectable()
export class EmotionalStateService {
  constructor(
    @InjectRepository(EmotionalStateEntity)
    private readonly repo: Repository<EmotionalStateEntity>,
  ) {}

  findById(userId: number) {
    return this.repo.findOne({ where: { userId } });
  }

  setState(userId: number, mood?: string, intensity?: number) {
    const state = this.repo.create({ userId, mood, intensity });
    return this.repo.save(state);
  }
}
