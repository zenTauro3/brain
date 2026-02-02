import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactEntity } from './facts.entity';
import { FactService } from './fact.service';

@Module({
  imports: [TypeOrmModule.forFeature([FactEntity])],
  providers: [FactService],
  exports: [FactService],
})
export class FactsModule {}
