import { IsString, IsNotEmpty } from 'class-validator';

export class BrainRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'No puedes enviar un mensaje vacío' })
  message!: string;
}