import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { ChatService } from './chat.service';
import { ChatRequestDto } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async processMessage(
    @Req() req: any,
    @Body() data: ChatRequestDto
  ) {
    const userId = req.user.id;

    const answer = await this.chatService.processChat(userId, data.message);
    
    return { answer };
  }
}