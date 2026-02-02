export class CreateFactDto {
  userId!: string;
  type!: string;
  value!: string;
  confidence?: number;
}

export class UpdateFactDto {
  value?: string;
  confidence?: number;
}
