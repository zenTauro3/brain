// chat.controller.ts
import { Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageClient } from './chat.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(): Promise<any> {
    const data: MessageClient = {
      userId: '9b7c2a0e-5f3a-4c9e-bf7d-3b9c8e1a4a22',
      message:
        "Hi, my name is John. I'm 32 years old, single, and I live in Madrid. I work as a software engineer and I love playing chess in my free time. I usually communicate via email, and my typical day starts with a morning run.",
    };

    const facts = await this.chatService.findFacts(data.userId);
    const embedding = await this.chatService.createEmbedding(data.message);
    const memories = await this.chatService.findMemories(data.userId, embedding);
    const { answer, newFacts, newMemories } = await this.chatService.generateAnswer(
      data.message,
      facts,
      memories,
    );

    /*
    if (newFacts) {
      for (const fact of newFacts) {
        await this.chatService.saveFact(data.userId, fact);
      }
    }

    if (newMemories) {
      for (const memory of newMemories) {
        await this.chatService.saveMemory(data.userId, memory);
      }
    }
      */

    return {
      answer,
      newFacts,
      newMemories,
    };
  }
}
