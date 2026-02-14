import { Fact } from '../knowledge/facts/facts.types';
import { EmotionalState } from '../knowledge/emotional_state/emotional_state.types';
import { Memory } from '../knowledge/memories/memories.types';
import { Goal } from '../knowledge/goals/goals.types';
import { Habit } from '../knowledge/habits/habits.types';
import { Trait } from '../knowledge/traits/traits.types';
import { Preference } from '../knowledge/preferences/preferences.types';
import { Belief } from '../knowledge/beliefs/beliefs.types';
import { Relationship } from '../knowledge/relationships/relationships.types';
import { FactEntity } from '../knowledge/facts/facts.entity';
import { MemoryEntity } from '../knowledge/memories/memories.entity';
import { GoalEntity } from '../knowledge/goals/goals.entity';
import { HabitEntity } from '../knowledge/habits/habits.entity';
import { TraitEntity } from '../knowledge/traits/traits.entity';
import { PreferenceEntity } from '../knowledge/preferences/preferences.entity';
import { BeliefEntity } from '../knowledge/beliefs/beliefs.entity';
import { RelationshipEntity } from '../knowledge/relationships/relationships.entity';
import { EmotionalStateEntity } from '../knowledge/emotional_state/emotional_state.entity';

export interface ChatRequest {
  userId: number;
  message: string;
}

export interface DBResult {
  facts: FactEntity[];
  memories: MemoryEntity[];
  goals: GoalEntity[];
  habits: HabitEntity[];
  traits: TraitEntity[];
  preferences: PreferenceEntity[];
  beliefs: BeliefEntity[];
  relationships: RelationshipEntity[];
  emotionalState?: EmotionalStateEntity;
}

export interface KnoweledgeELements {
  facts: Fact[];
  memories: Memory[];
  goals: Goal[];
  habits: Habit[];
  traits: Trait[];
  preferences: Preference[];
  beliefs: Belief[];
  relationships: Relationship[];
  emotionalState?: EmotionalState;
}

export interface AnswerResult {
  answer: string;
  newElements: KnoweledgeELements;
}
