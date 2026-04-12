import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterRequestDto, LoginRequestDto, RefreshRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { ApiStandardResponse, ApiStandardErrorResponse } from '@/common/decorators/api-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user in the platform' })
  @ApiStandardResponse(201, 'User created successfully.', AuthResponseDto)
  @ApiStandardErrorResponse(409, 'Conflict', 'CONFLICT', 'Email already in use')
  async register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive access tokens' })
  @ApiStandardResponse(200, 'Login successful.', AuthResponseDto)
  @ApiStandardErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED', 'Invalid credentials')
  async login(@Body() body: LoginRequestDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew access token using a refresh token' })
  @ApiStandardResponse(200, 'New access token generated.', RefreshResponseDto)
  @ApiStandardErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED', 'Invalid or expired refresh token')
  async refresh(@Body() body: RefreshRequestDto) {
    return this.authService.refresh(body.refresh_token);
  }
}
