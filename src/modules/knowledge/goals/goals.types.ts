export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'on_hold'
  | 'abandoned';

export interface Goal {
  title: string;
  description?: string;
  status: GoalStatus;
  priority?: number;    
  confidence: number;   
  sourceText: string;
}
