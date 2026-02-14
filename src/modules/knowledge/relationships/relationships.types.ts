export type RelationshipRole =
  | 'family'
  | 'friend'
  | 'partner'
  | 'colleague'
  | 'acquaintance'
  | 'mentor'
  | 'other';


export interface Relationship {
  name: string;          
  role?: RelationshipRole;           
  closeness?: number;      
  notes?: string;     
  confidence: number;     
  sourceText: string;    
}
