// chat.controller.ts
import { Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageClient } from './chat.types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(): Promise<any> {
    const data: MessageClient = {
      userId: '9b7c2a0e-5f3a-4c9e-bf7d-3b9c8e1a4a22',
      message: '¿How should I contact Juan?',
    };

    const nlu = await this.chatService.extractNLU(data.message);
    const facts = await this.chatService.findFacts(data.userId, nlu.entities);
    const embedding = await this.chatService.createEmbedding(data.message);
    const memories = await this.chatService.findMemories(data.userId, embedding);

    const { answer, newFact, newMemory } = await this.chatService.generateAnswer(
      facts,
      memories,
      data.message,
    );

    let savedFact = null;
    try {
      if (newFact && newFact.key && newFact.value) {
        const factToSave = {
          key: newFact.key,
          value: newFact.value,
          confidence: typeof newFact.confidence === 'number' ? newFact.confidence : 0.9,
        };
        savedFact = await this.chatService.upsertOrReturnExistingFact(data.userId, factToSave);
      }
    } catch (err) {
      console.warn('Failed saving newFact:', err);
    }

    let savedMemory = null;
    try {
      if (newMemory && newMemory.content) {
        const memToSave = {
          content: newMemory.content,
          importance: Number(newMemory.importance ?? 1),
          embedding: embedding,
        };
        savedMemory = await this.chatService.saveMemory(data.userId, memToSave);
      }
    } catch (err) {
      console.warn('Failed saving newMemory:', err);
    }

    return {
      answer,
      savedFact,
      savedMemory,
    };
  }
}
