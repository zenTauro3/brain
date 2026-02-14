import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitEntity } from './habits.entity';
import { HabitsService } from './habits.service';

@Module({
  imports: [TypeOrmModule.forFeature([HabitEntity])],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
