import { Module } from '@nestjs/common';
import { EmbeddingsService } from '../knowledge/embeddings.service';
import { FactsService } from '../knowledge/facts.service';
import { MemoriesService } from '../knowledge/memories.service';
import { GoalsService } from '../knowledge/goals.service';
import { HabitsService } from '../knowledge/habits.service';
import { TraitsService } from '../knowledge/traits.service';
import { PreferencesService } from '../knowledge/preferences.service';
import { BeliefsService } from '../knowledge/beliefs.service';
import { RelationshipsService } from '../knowledge/relationships.service';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    EmbeddingsService,
    FactsService,
    MemoriesService,
    GoalsService,
    HabitsService,
    TraitsService,
    PreferencesService,
    BeliefsService,
    RelationshipsService,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
