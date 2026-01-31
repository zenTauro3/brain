import { Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageClient } from './chat.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(): Promise<string> {
    const data: MessageClient = {
      userId: '9b7c2a0e-5f3a-4c9e-bf7d-3b9c8e1a4a22',
      message: '¿Cómo debería contactar a Juan?',
    };

    const nlu = await this.chatService.extractNLU(data.message);
    const facts = await this.chatService.findFacts(data.userId, nlu.entities);
    const embedding = await this.chatService.createEmbedding(data.message);
    const memories = await this.chatService.findMemories(data.userId, embedding);
    const answer = await this.chatService.generateAnswer(facts, memories, data.message);

    // if (newFact) await this.chatService.saveFact(data.userId, newFact);
    // if (newMemory) await this.chatService.saveMemory(data.userId, newMemory);

    return answer;
  }
}
