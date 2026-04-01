import { 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsOptional 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'jaume@ejemplo.com', description: 'Correo electrónico del usuario' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Debes proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Contraseña (mínimo 6 caracteres)', minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña es demasiado larga' }) 
  password!: string;

  @ApiProperty({ example: 'JaumeTauro', description: 'Nombre de usuario público', required: false, maxLength: 30 })
  @Transform(({ value }) => value?.trim()) 
  @IsString()
  @IsOptional() 
  @MaxLength(30, { message: 'El nombre de usuario no puede superar los 30 caracteres' })
  username?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'jaume@ejemplo.com', description: 'Correo electrónico' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'Debes proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}

export class RefreshDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...', description: 'El token de refresco JWT' })
  @IsString()
  @IsNotEmpty({ message: 'El token de refresco es obligatorio' })
  refresh_token!: string;
}