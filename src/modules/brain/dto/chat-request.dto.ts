import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({ 
    example: '¿Cómo funciona la gravedad?', 
    description: 'The message sent by the user to the AI' 
  })
  @IsString()
  @IsNotEmpty({ message: 'The message cannot be empty' })
  @MaxLength(2000, { message: 'Message is too long. Max 2000 characters.' }) 
  message!: string;
}