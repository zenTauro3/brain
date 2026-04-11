import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-1234-5678', description: 'Unique user identifier' })
  id!: string;

  @ApiProperty({ example: 'jaume@example.com', description: "User's email" })
  email!: string;

  @ApiProperty({ example: 'JaumeTauro', description: 'Public username' })
  username!: string;
}