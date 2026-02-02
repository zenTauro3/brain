import { Module } from '@nestjs/common';
import { FactsModule } from '../facts/facts.module';
import { MemoriesModule } from '../memories/memories.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [FactsModule, MemoriesModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
