import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrainService } from './brain.service';
import { BrainRequestDto } from './dto/brain.dto';
import { ApiStandardResponse, ApiStandardErrorResponse } from '@/common/decorators/api-response.decorator';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
@Controller('chat')
export class BrainController {
  constructor(private readonly brainService: BrainService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message to the AI and get a response' })
  
  @ApiStandardResponse(200, 'AI response generated successfully', 'The AI answer is 42.')
  @ApiStandardErrorResponse(400, 'Invalid data', 'BAD_REQUEST', 'The message field is required')
  @ApiStandardErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED', 'Missing or expired JWT token')
  @ApiStandardErrorResponse(429, 'Too many requests', 'TOO_MANY_REQUESTS', 'You have exceeded the messages per minute limit')
  
  async processMessage(@Req() req: any, @Body() data: BrainRequestDto) {
    const userId = req.user.id;
    const answer = await this.brainService.processChat(userId, data.message);
    return answer;
  }
}