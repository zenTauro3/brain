import { IsString, IsNotEmpty } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El userId es obligatorio para identificar el cerebro' })
  userId!: string;

  @IsString()
  @IsNotEmpty({ message: 'No puedes enviar un mensaje vacío' })
  message!: string;
}