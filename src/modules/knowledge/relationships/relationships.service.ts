import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationshipEntity } from './relationships.entity';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(RelationshipEntity)
    private readonly repo: Repository<RelationshipEntity>,
  ) {}

  findById(userId: number, id: number) {
    return this.repo.findOne({ where: { id, userId } });
  }
}
