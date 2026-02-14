import { Module } from '@nestjs/common';
import { EmbeddingsModule } from '../knowledge/embeddings/embeddings.module';
import { FactsModule } from '../knowledge/facts/facts.module';
import { GoalsModule } from '../knowledge/goals/goals.module';
import { BeliefsModule } from '../knowledge/beliefs/beliefs.module';
import { EmotionalStateModule } from '../knowledge/emotional_state/emotional_state.module';
import { HabitsModule } from '../knowledge/habits/habits.module';
import { MemoriesModule } from '../knowledge/memories/memories.module';
import { PreferencesModule } from '../knowledge/preferences/preferences.module';
import { RelationshipsModule } from '../knowledge/relationships/relationships.module';
import { TraitsModule } from '../knowledge/traits/traits.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    EmbeddingsModule,
    FactsModule,
    MemoriesModule,
    GoalsModule,
    BeliefsModule,
    EmotionalStateModule,
    HabitsModule,
    PreferencesModule,
    RelationshipsModule,
    TraitsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
