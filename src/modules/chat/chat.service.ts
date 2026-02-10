import { Injectable, Logger } from '@nestjs/common';
import { Fact, Memory } from './chat.types';
import { ASK_SYSTEM_PROMPT, ASK_USER_PROMPT } from './chat.constants';
import { EmbeddingsService } from '../knowledge/embeddings.service';
import { FactsService } from '../knowledge/facts.service';
import { MemoriesService } from '../knowledge/memories.service';
import { GoalsService } from '../knowledge/goals.service';
import { HabitsService } from '../knowledge/habits.service';
import { TraitsService } from '../knowledge/traits.service';
import { PreferencesService } from '../knowledge/preferences.service';
import { BeliefsService } from '../knowledge/beliefs.service';
import { RelationshipsService } from '../knowledge/relationships.service';
import { FactEntity } from '../knowledge/facts.entity';
import { MemoryEntity } from '../knowledge/memories.entity';
import { GoalEntity } from '../knowledge/goals.entity';
import { HabitEntity } from '../knowledge/habits.entity';
import { TraitEntity } from '../knowledge/traits.entity';
import { PreferenceEntity } from '../knowledge/preferences.entity';
import { BeliefEntity } from '../knowledge/beliefs.entity';
import { RelationshipEntity } from '../knowledge/relationships.entity';
import { EmotionalStateService } from '../knowledge/emotional_state.service';
import { EmotionalStateEntity } from '../knowledge/emotional_state.entity';

@Injectable()
export class ChatService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private factsService: FactsService,
    private memoriesService: MemoriesService,
    private goalsService: GoalsService,
    private habitsService: HabitsService,
    private traitsService: TraitsService,
    private preferencesService: PreferencesService,
    private beliefsService: BeliefsService,
    private relationshipsService: RelationshipsService,
    private emotionalStateService: EmotionalStateService,
  ) {}

  private readonly logger = new Logger(ChatService.name);

  async getUserKnowledge(userId: number, message: string) {
    const vector = await this.embeddingsService.createEmbedding(message);
    const embeddings = await this.embeddingsService.searchEmbeddings(userId, vector, 5);

    const result: {
      facts: FactEntity[];
      memories: MemoryEntity[];
      goals: GoalEntity[];
      habits: HabitEntity[];
      traits: TraitEntity[];
      preferences: PreferenceEntity[];
      beliefs: BeliefEntity[];
      relationships: RelationshipEntity[];
      emotionalState?: EmotionalStateEntity;
    } = {
      facts: [],
      memories: [],
      goals: [],
      habits: [],
      traits: [],
      preferences: [],
      beliefs: [],
      relationships: [],
      emotionalState: undefined,
    };

    for (const emb of embeddings) {
      if (!emb.sourceId) continue;

      switch (emb.sourceType) {
        case 'fact': {
          const fact = await this.factsService.findById(userId, emb.sourceId);
          if (fact) result.facts.push(fact);
          break;
        }

        case 'memory': {
          const memory = await this.memoriesService.findById(userId, emb.sourceId);
          if (memory) result.memories.push(memory);
          break;
        }

        case 'goal': {
          const goal = await this.goalsService.findById(userId, emb.sourceId);
          if (goal) result.goals.push(goal);
          break;
        }

        case 'habit': {
          const habit = await this.habitsService.findById(userId, emb.sourceId);
          if (habit) result.habits.push(habit);
          break;
        }

        case 'trait': {
          const trait = await this.traitsService.findById(userId, emb.sourceId);
          if (trait) result.traits.push(trait);
          break;
        }

        case 'preference': {
          const pref = await this.preferencesService.findById(userId, emb.sourceId);
          if (pref) result.preferences.push(pref);
          break;
        }

        case 'belief': {
          const belief = await this.beliefsService.findById(userId, emb.sourceId);
          if (belief) result.beliefs.push(belief);
          break;
        }

        case 'relationship': {
          const rel = await this.relationshipsService.findById(userId, emb.sourceId);
          if (rel) result.relationships.push(rel);
          break;
        }

        case 'emotional_state': {
          const state = await this.emotionalStateService.findById(userId);
          if (state) result.emotionalState = state;
        }
      }
    }

    return result;
  }

  async generateAnswer(
    message: string,
    userKnowledge: ReturnType<typeof this.getUserKnowledge>,
  ): Promise<{
    answer: string;
    newFacts: Fact[] | null;
    newMemories: Memory[] | null;
    newGoals: Goal[] | null;
    newHabits: Habit[] | null;
    newTraits: Trait[] | null;
    newPreferences: Preference[] | null;
    newBeliefs: Belief[] | null;
    newRelationships: Relationship[] | null;
    newEmotionalState?: EmotionalState | null;
  }> {
    try {
      // Llamada a OpenAI
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 600,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: ASK_SYSTEM_PROMPT },
          { role: 'user', content: ASK_USER_PROMPT(userKnowledge, message) },
        ],
      });

      const raw = completion.choices[0].message?.content ?? '{}';

      // Parse seguro
      const parsed: {
        answer?: string;
        newFacts?: Fact[];
        newMemories?: Memory[];
        newGoals?: Goal[];
        newHabits?: Habit[];
        newTraits?: Trait[];
        newPreferences?: Preference[];
        newBeliefs?: Belief[];
        newRelationships?: Relationship[];
        newEmotionalState?: EmotionalState;
      } = JSON.parse(raw);

      return {
        answer: parsed.answer ?? '',
        newFacts: parsed.newFacts ?? null,
        newMemories: parsed.newMemories ?? null,
        newGoals: parsed.newGoals ?? null,
        newHabits: parsed.newHabits ?? null,
        newTraits: parsed.newTraits ?? null,
        newPreferences: parsed.newPreferences ?? null,
        newBeliefs: parsed.newBeliefs ?? null,
        newRelationships: parsed.newRelationships ?? null,
        newEmotionalState: parsed.newEmotionalState ?? null,
      };
    } catch (err) {
      this.logger.warn('Invalid JSON from LLM: ' + err);

      return {
        answer: '',
        newFacts: null,
        newMemories: null,
        newGoals: null,
        newHabits: null,
        newTraits: null,
        newPreferences: null,
        newBeliefs: null,
        newRelationships: null,
        newEmotionalState: null,
      };
    }
  }
}
