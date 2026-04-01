import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger'; 
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto } from './dto/auth.dto'; 

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra un nuevo usuario en la plataforma' })
  @SwaggerResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente.',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: { id: 1, email: 'jaume@ejemplo.com', username: 'Jaume' }
      }
    }
  })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  @ApiOperation({ summary: 'Inicia sesión y devuelve los tokens de acceso' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Login exitoso.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          access_token: 'eyJhbGciOiJIUzI1...',
          refresh_token: 'def456...'
        }
      }
    }
  })
  @SwaggerResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renueva el token de acceso usando el Refresh Token' })
  @SwaggerResponse({ 
    status: 200, 
    description: 'Nuevo Access Token generado.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { access_token: 'eyJhbGciOiJIUzI1...' }
      }
    }
  })
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }
}