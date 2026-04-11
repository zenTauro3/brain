import { Inject, Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service';
import { envConfig } from '@/config/env.config';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(envConfig.KEY)
    private readonly config: ConfigType<typeof envConfig>,
  ) {}

  async register(email: string, passwordPlain: string, username: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
    });

    this.logger.log(`New user registered: ${email}`);

    return this.generateAuthResponse(newUser);
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.jwt.refreshSecret,
      });

      const tokens = this.generateTokens(payload.sub, payload.email);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };

    } catch (error: any) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateAuthResponse(user: User) {
    const tokens = this.generateTokens(user.id, user.email);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    };
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