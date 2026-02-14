import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TraitEntity } from './traits.entity';

@Injectable()
export class TraitsService {
  constructor(
    @InjectRepository(TraitEntity)
    private readonly repo: Repository<TraitEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
