import { DBResult } from './chat.types';
import { z } from 'zod';

export const FactTypes = z.enum([
  'NAME',
  'DATE_OF_BIRTH',
  'GENDER',
  'COUNTRY',
  'CITY',
  'MARITAL_STATUS',
  'HAS_CHILDREN',
  'OCCUPATION',
  'EDUCATION_LEVEL',
  'PERSONALITY_TRAIT',
  'FAVORITE_ACTIVITY',
  'PREFERRED_COMMUNICATION',
  'CURRENT_LOCATION',
  'DAILY_ROUTINE',
]);

export const FactSchema = z.object({
  key: FactTypes,
  value: z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.string(), z.any())]),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- MEMORIES ---
export const MemoryCategory = z.enum([
  'personal_history',
  'work',
  'education',
  'event',
  'milestone',
  'other',
]);

export const MemorySchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  category: MemoryCategory.optional(),
  emotionalWeight: z.number().min(0).max(10).optional(),
  isPersistent: z.boolean(),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- GOALS ---
export const GoalStatus = z.enum([
  'not_started',
  'in_progress',
  'completed',
  'on_hold',
  'abandoned',
]);

export const GoalSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: GoalStatus,
  priority: z.number().min(0).max(5).optional(),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- HABITS ---
export const HabitSchema = z.object({
  habit: z.string(),
  frequency: z.string().optional(), // podría ser más estructurado si quieres
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- TRAITS ---
export const TraitSchema = z.object({
  trait: z.string(),
  score: z.number().min(0).max(10).optional(),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- PREFERENCES ---
export const PreferenceCategory = z.enum([
  'music',
  'food',
  'communication',
  'travel',
  'sport',
  'tech',
  'other',
]);

export const PreferenceValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.record(z.string(), z.any()),
]);

export const PreferenceSchema = z.object({
  category: PreferenceCategory,
  value: PreferenceValue,
  strength: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- BELIEFS ---
export const BeliefSchema = z.object({
  belief: z.string(),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- RELATIONSHIPS ---
export const RelationshipRole = z.enum([
  'family',
  'friend',
  'partner',
  'colleague',
  'acquaintance',
  'mentor',
  'other',
]);

export const RelationshipSchema = z.object({
  name: z.string(),
  role: RelationshipRole.optional(),
  closeness: z.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

// --- EMOTIONAL STATE ---
export const EmotionalStateSchema = z.object({
  mood: z.enum(['neutral', 'happy', 'sad', 'anxious', 'angry', 'hopeful', 'calm', 'confused']),
  intensity: z.number().min(0).max(10),
  confidence: z.number().min(0).max(1),
  sourceText: z.string(),
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

export const KnoweledgeELementsSchema = z.object({
  facts: z.array(FactSchema),
  memories: z.array(MemorySchema),
  goals: z.array(GoalSchema),
  habits: z.array(HabitSchema),
  traits: z.array(TraitSchema),
  preferences: z.array(PreferenceSchema),
  beliefs: z.array(BeliefSchema),
  relationships: z.array(RelationshipSchema),
  emotionalState: EmotionalStateSchema.optional(),
});

export const AnswerResultSchema = z.object({
  answer: z.string(),
  newElements: KnoweledgeELementsSchema,
});

console.log(AnswerResultSchema);

export const ASK_SYSTEM_PROMPT = `
You are an intelligent personal knowledge engine.

Your responsibilities:

1. Answer the user's message naturally and helpfully.
2. Use the provided existing user knowledge when relevant.
3. Extract NEW knowledge elements from the current message only.
4. Never invent facts.
5. Never duplicate existing knowledge.
6. Only extract information that is explicitly stated or strongly implied.
7. If nothing new is found for a category, return an empty array.
8. Emotional state should reflect the CURRENT message only.

You must return ONLY valid JSON.
Do not include explanations.
Do not include markdown.
Do not include extra text.

Output structure:

${JSON.stringify(AnswerResultSchema, null, 2)}
`;

export const ASK_USER_PROMPT = (dbResult: DBResult, message: string) => `
CURRENT USER MESSAGE:
"""
${message}
"""

EXISTING USER KNOWLEDGE:
${JSON.stringify(dbResult)}

INSTRUCTIONS:

1. First, generate a natural language answer to the user.
2. Then extract ONLY NEW knowledge from the CURRENT USER MESSAGE.
3. Do NOT re-extract anything already present in EXISTING USER KNOWLEDGE.
4. If unsure about something, do not extract it.
5. Confidence must be between 0 and 1.
6. Scores must be normalized:
   - closeness: 0-10
   - emotionalWeight: 0-10
   - priority: 0-5
   - intensity: 0-10
7. role must be one of:
   family, friend, partner, colleague, acquaintance, mentor, other
8. Return empty arrays if no new elements are found.
9. emotionalState should represent only the emotional tone of the CURRENT USER MESSAGE.
`;
