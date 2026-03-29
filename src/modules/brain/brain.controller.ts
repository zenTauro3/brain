import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BrainService } from './brain.service';
import { BrainRequestDto } from '../brain/dto/brain.dto';

@Controller('chat')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
export class BrainController {
  constructor(private readonly brainService: BrainService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processMessage(@Req() req: any, @Body() data: BrainRequestDto) {
    const userId = req.user.id;
    const answer = await this.brainService.processChat(userId, data.message);
    return answer;
  }
}
