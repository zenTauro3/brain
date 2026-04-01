import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Perfil recuperado con éxito.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 'uuid-123', email: 'user@axon.com', username: 'Jaume' }
      }
    }
  })
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}