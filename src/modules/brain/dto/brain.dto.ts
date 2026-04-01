import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BrainRequestDto {
  @ApiProperty({ 
    example: '¿Cuál es el sentido de la vida?', 
    description: 'El mensaje que el usuario envía a la IA' 
  })
  @IsString()
  @IsNotEmpty({ message: 'No puedes enviar un mensaje vacío' })
  message!: string;
}