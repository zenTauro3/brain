export interface MessageClient {
  userId: string;
  message: string;
}

export interface Memory {
  content: string;
  importance: number;
  embedding: number[];
}
