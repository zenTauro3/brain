import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactEntity } from './facts.entity';
import { CreateFactDto, UpdateFactDto } from './facts.types';

@Injectable()
export class FactService {
  constructor(
    @InjectRepository(FactEntity)
    private factRepo: Repository<FactEntity>,
  ) {
    console.log('FactService instantiated');
  }

  async findFacts(userId: string): Promise<FactEntity[]> {
    const result = await this.factRepo.find({ where: { userId } });
    return result;
  }

  async saveFact(createFactDto: CreateFactDto): Promise<FactEntity> {
    const entity = this.factRepo.create(createFactDto);
    return this.factRepo.save(entity);
  }

  async updateFact(id: number, updateDto: UpdateFactDto): Promise<FactEntity | null> {
    await this.factRepo.update(id, updateDto);
    return this.factRepo.findOneBy({ id });
  }

  async findFactByType(userId: string, type: string): Promise<FactEntity | null> {
    return this.factRepo.findOne({ where: { userId, type } });
  }
}
