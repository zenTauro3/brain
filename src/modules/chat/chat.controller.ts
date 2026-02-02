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
      message: "Which is my dad's name?",
    };

    const embedding = await this.chatService.createEmbedding(data.message);
    const memories = await this.chatService.findMemories(data.userId, embedding);
    const { answer, newMemories } = await this.chatService.generateAnswer(data.message, memories);

    if (newMemories) {
      for (const memory of newMemories) {
        await this.chatService.saveMemory(data.userId, memory);
      }
    }

    return {
      answer,
      newMemories,
    };
  }
}
