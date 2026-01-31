export interface MessageClient {
  userId: string;
  message: string;
}

export interface ExtractedNLU {
  intent: string;
  entities: { type: string; value: string }[];
  topics: string[];
}

export interface Fact {
  key: string;
  value: any;
  confidence: number;
}

export interface Memory {
  content: string;
  importance: number;
  embedding: number[];
}
