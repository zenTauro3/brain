import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memory } from './entities/memory.entity';
import { Embedding } from './entities/embedding.entity';
import { BrainController } from './brain.controller';
import { BrainService } from './brain.service';

@Module({
  imports: [TypeOrmModule.forFeature([Memory, Embedding])],
  controllers: [BrainController],
  providers: [BrainService],
  exports: [BrainService],
})
export class BrainModule {}