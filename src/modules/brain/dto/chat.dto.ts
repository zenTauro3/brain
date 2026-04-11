import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({ 
    example: 'What is the meaning of life?', 
    description: 'The message the user sends to the AI' 
  })
  @IsString()
  @IsNotEmpty({ message: 'The message cannot be empty' })
  message!: string;
}