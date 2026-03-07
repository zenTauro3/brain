import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memory } from '@modules/brain/entities/memory.entity';
import { Embedding } from '@modules/brain/entities/embedding.entity';
import { BrainService } from './brain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Memory, Embedding]),
  ],
  providers: [BrainService],
  exports: [BrainService], 
})
export class BrainModule {}