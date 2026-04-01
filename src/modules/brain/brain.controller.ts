// src/modules/brain/brain.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger'; // 👈 Swagger imports
import { BrainService } from './brain.service';
import { BrainRequestDto } from './dto/brain.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), ThrottlerGuard)
@Controller('chat')
export class BrainController {
  constructor(private readonly brainService: BrainService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar un mensaje a la IA y obtener respuesta' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Respuesta generada por la IA exitosamente.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: "La respuesta de la IA es 42."
      }
    }
  })
  @SwaggerResponse({ status: 401, description: 'No autorizado (Falta o falla el JWT)' })
  async processMessage(@Req() req: any, @Body() data: BrainRequestDto) {
    const userId = req.user.id;
    const answer = await this.brainService.processChat(userId, data.message);
    return answer;
  }
}