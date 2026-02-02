export class CreateMemoryDto {
  userId!: string;
  content!: string;
  embedding?: number[];
  importance?: number;
  confidence?: number;
}
export class UpdateMemoryDto {
  content?: string;
  embedding?: number[];
  importance?: number;
  confidence?: number;
}
