import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbeddingEntity } from './embeddings.entity';
import { EmbeddingsService } from './embeddings.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmbeddingEntity])],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
