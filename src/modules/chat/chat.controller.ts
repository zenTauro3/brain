import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/request.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processMessage(@Body() data: ChatRequestDto) {
    const answer = await this.chatService.processChat(data.userId, data.message);
    return { answer };
  }
}
