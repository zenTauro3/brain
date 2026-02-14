import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeliefEntity } from './beliefs.entity';
import { BeliefsService } from './beliefs.service';

@Module({
  imports: [TypeOrmModule.forFeature([BeliefEntity])],
  providers: [BeliefsService],
  exports: [BeliefsService],
})
export class BeliefsModule {}
