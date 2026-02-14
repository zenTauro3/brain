export interface Memory {
  title?: string;           
  content: string;          
  category?: string;       
  emotionalWeight?: number; 
  isPersistent: boolean;   
  confidence: number;      
  sourceText: string;       
}
