import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEntity } from './memories.entity';
import { MemoriesService } from './memories.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryEntity])],
  providers: [MemoriesService],
  exports: [MemoriesService],
})
export class MemoriesModule {}
