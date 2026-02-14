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

    const userKnowledge = await this.chatService.getUserKnowledge(data.userId, data.message);
    const { answer, newElements } = await this.chatService.generateAnswer(
      data.message,
      userKnowledge,
    );

    console.log('New elements to add to the knowledge base:', newElements);

    return { answer };
  }
}
