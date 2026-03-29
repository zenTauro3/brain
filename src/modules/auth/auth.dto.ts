import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Debes proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres por seguridad' })
  password!: string;

  @IsString()
  @IsOptional() 
  username?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Debes proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}

export class RefreshDto {
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  refreshToken!: string;
}