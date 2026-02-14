import { Injectable } from '@nestjs/common';
import { ASK_SYSTEM_PROMPT, ASK_USER_PROMPT } from './chat.constants';
import { EmbeddingsService } from '../knowledge/embeddings/embeddings.service';
import { FactsService } from '../knowledge/facts/facts.service';
import { MemoriesService } from '../knowledge/memories/memories.service';
import { GoalsService } from '../knowledge/goals/goals.service';
import { HabitsService } from '../knowledge/habits/habits.service';
import { TraitsService } from '../knowledge/traits/traits.service';
import { PreferencesService } from '../knowledge/preferences/preferences.service';
import { BeliefsService } from '../knowledge/beliefs/beliefs.service';
import { RelationshipsService } from '../knowledge/relationships/relationships.service';
import { EmotionalStateService } from '../knowledge/emotional_state/emotional_state.service';
import OpenAI from 'openai';
import { AnswerResult, DBResult } from './chat.types';

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

  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  async getUserKnowledge(userId: number, message: string) {
    const result: DBResult = {
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

    try {
      const vector = await this.embeddingsService.createEmbedding(message);
      const embeddings = await this.embeddingsService.searchEmbeddings(userId, vector);

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
    } catch (err) {
      console.error('Error buscando embeddings:', err);
      return result;
    }
  }
  async generateAnswer(message: string, userKnowledge: DBResult): Promise<AnswerResult> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 800,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: ASK_SYSTEM_PROMPT },
          { role: 'user', content: ASK_USER_PROMPT(userKnowledge, message) },
        ],
      });

      const raw = completion.choices[0].message?.content ?? '{}';
      const parsed = JSON.parse(raw);

      return parsed.def;
    } catch (err) {
      console.log('Error at openai API answer generation.', err);

      return {
        answer: '',
        newElements: {
          facts: [],
          memories: [],
          goals: [],
          habits: [],
          traits: [],
          preferences: [],
          beliefs: [],
          relationships: [],
          emotionalState: undefined,
        },
      };
    }
  }
}
