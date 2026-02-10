export interface ChatRequest {
  userId: number;
  message: string;
}

export interface Fact {
  type: string;
  value: string;
  confidence: number;
}

export interface Memory {
  content: string;
  importance: number;
  embedding: number[];
}
