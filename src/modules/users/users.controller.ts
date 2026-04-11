import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ApiStandardResponse, ApiStandardErrorResponse } from '@/common/decorators/api-response.decorator';
import { UserResponseDto } from '@/modules/users/dto/users-response.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiStandardResponse(200, 'Profile retrieved successfully.', UserResponseDto)
  @ApiStandardErrorResponse(404, 'Not Found', 'USER_NOT_FOUND', 'User no longer exists')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.sub || req.user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
