import { 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'jaume@example.com', 
    description: "User's email address",
    required: true 
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Password (minimum 6 characters)', 
    minLength: 6,
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password is too long (maximum 50 characters)' }) 
  password!: string;

  @ApiProperty({ 
    example: 'JaumeTauro', 
    description: 'Public display name', 
    maxLength: 30,
    required: true
  })
  @Transform(({ value }) => value?.trim()) 
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  username!: string;
}

export class LoginDto {
  @ApiProperty({ 
    example: 'jaume@example.com', 
    description: 'Account email address',
    required: true 
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ 
    example: '123456', 
    description: "User's password",
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

export class RefreshDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR...', 
    description: 'The JWT Refresh Token provided during login',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token!: string;
}