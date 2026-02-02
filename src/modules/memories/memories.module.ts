import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEntity } from './memories.entity';
import { MemoryService } from './memories.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryEntity])],
  providers: [MemoryService],
  exports: [MemoryService],
})
export class MemoriesModule {}
