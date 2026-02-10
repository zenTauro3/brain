import OpenAI from 'openai';

export const OpenAiProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: () => {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  },
};
