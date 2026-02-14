import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactEntity } from './facts.entity';
import { FactsService } from './facts.service';

@Module({
  imports: [TypeOrmModule.forFeature([FactEntity])],
  providers: [FactsService],
  exports: [FactsService],
})
export class FactsModule {}
