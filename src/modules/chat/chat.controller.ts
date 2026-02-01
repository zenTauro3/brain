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

    // 1) NLU
    const nlu = await this.chatService.extractNLU(data.message);

    // 2) buscar facts existentes
    const facts = await this.chatService.findFacts(data.userId, nlu.entities);

    // 3) crear embedding
    const embedding = await this.chatService.createEmbedding(data.message);

    // 4) buscar memorias
    const memories = await this.chatService.findMemories(data.userId, embedding);

    // 5) pedir respuesta + candidates (newFact/newMemory) al LLM
    const { answer, newFact, newMemory } = await this.chatService.generateAnswerAndCandidates(facts, memories, data.message);

    // 6) si LLM propuso newFact, insertar solo si no existía
    let savedFact = null;
    try {
      if (newFact && newFact.key && newFact.value) {
        // normalizar objeto a Fact type
        const factToSave = {
          key: newFact.key,
          value: newFact.value,
          confidence: typeof newFact.confidence === 'number' ? newFact.confidence : 0.9,
        };
        savedFact = await this.chatService.upsertOrReturnExistingFact(data.userId, factToSave);
      }
    } catch (err) {
      // log y seguir — no queremos que un fallo al guardar bloquee la respuesta
      // ideal: metrics / sentry
      console.warn('Failed saving newFact:', err);
    }

    // 7) si LLM propuso newMemory, guardar
    let savedMemory = null;
    try {
      if (newMemory && newMemory.content) {
        const memToSave = {
          content: newMemory.content,
          importance: Number(newMemory.importance ?? 1),
          embedding: embedding, // usamos el embedding ya calculado de la petición
        };
        savedMemory = await this.chatService.saveMemory(data.userId, memToSave);
      }
    } catch (err) {
      console.warn('Failed saving newMemory:', err);
    }

    // 8) devolvemos la respuesta + lo que se guardó (si se guardó)
    return {
      answer,
      savedFact,
      savedMemory,
    };
  }
}
