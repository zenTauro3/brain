import { Inject, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service';
import { envConfig } from '@/config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(envConfig.KEY)
    private config: ConfigType<typeof envConfig>,
  ) {}

  async register(email: string, passwordPlain: string, username?: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException('El email ya está en uso');

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
    });

    return this.generateTokens(newUser.id, newUser.email);
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');

    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwt.refreshSecret,
      });

      return this.generateTokens(payload.sub, payload.email);
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o caducado');
    }
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.config.jwt.secret,
        expiresIn: '1h',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.config.jwt.refreshSecret,
        expiresIn: '7d',
      }),
    };
  }
}