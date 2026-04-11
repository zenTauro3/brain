import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/modules/users/dto/users-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'JWT Access Token (1h)' })
  access_token!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'JWT Refresh Token (7d)' })
  refresh_token!: string;

  @ApiProperty({ type: () => UserResponseDto, description: 'User data profile' })
  user!: UserResponseDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'New JWT Access Token' })
  access_token!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'New JWT Refresh Token' })
  refresh_token!: string;
}
