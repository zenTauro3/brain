export type PreferenceValue =
  | string
  | number
  | boolean
  | null
  | Record<string, any>;

export interface Preference {
  category: string;       
  value: PreferenceValue; 
  strength: number;     
  sourceText: string;     
}
