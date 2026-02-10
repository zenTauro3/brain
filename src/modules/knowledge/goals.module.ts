import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalEntity } from './goals.entity';
import { GoalsService } from './goals.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity])],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
