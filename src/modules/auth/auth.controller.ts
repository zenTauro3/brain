import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto } from './dto/auth.dto';
import { ApiStandardResponse, ApiStandardErrorResponse } from '@/common/decorators/api-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user in the platform' })
  @ApiStandardResponse(201, 'User created successfully.', {
    id: 'uuid-123',
    email: 'jaume@example.com',
    username: 'Jaume',
  })
  @ApiStandardErrorResponse(409, 'Conflict', 'CONFLICT', 'Email already in use')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive access tokens' })
  @ApiStandardResponse(200, 'Login successful.', {
    access_token: 'eyJhbGciOiJIUzI1...',
    refresh_token: 'def456...',
  })
  @ApiStandardErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED', 'Invalid credentials')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew access token using a refresh token' })
  @ApiStandardResponse(200, 'New access token generated.', {
    access_token: 'eyJhbGciOiJIUzI1...',
  })
  @ApiStandardErrorResponse(401, 'Unauthorized', 'UNAUTHORIZED', 'Invalid or expired refresh token')
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }
}