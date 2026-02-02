import { Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequest } from './chat.types';
import { askRequest } from './chat.mock';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async ask() {
    const data: ChatRequest = askRequest;
    const facts = await this.chatService.findFacts(data.userId);
    const embedding = await this.chatService.createEmbedding(data.message);
    const memories = await this.chatService.findMemories(data.userId, embedding);

    const { answer, newFacts, newMemories } = await this.chatService.generateAnswer(
      data.message,
      facts,
      memories,
    );

    if (newFacts?.length) {
      for (const fact of newFacts) await this.chatService.saveFact(data.userId, fact);
    }

    if (newMemories?.length) {
      for (const memory of newMemories) await this.chatService.saveMemory(data.userId, memory);
    }

    return { answer, newFacts, newMemories };
  }
}
