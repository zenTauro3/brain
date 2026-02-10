import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionalStateEntity } from './emotional_state.entity';
import { EmotionalStateService } from './emotional_state.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmotionalStateEntity])],
  providers: [EmotionalStateService],
  exports: [EmotionalStateService],
})
export class EmotionalStateModule {}
