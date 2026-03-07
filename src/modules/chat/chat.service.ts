import { Injectable, Logger } from '@nestjs/common';
import { BrainService } from '@modules/brain/brain.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly brainService: BrainService) {}

  async processChat(userId: string, message: string): Promise<string> {
    
    const userKnowledge = await this.brainService.getFormattedKnowledge(userId);
    const answer = await this.brainService.generateAnswer(message, userKnowledge);

    this.brainService.generateAndSaveKnowledge(userId, message, userKnowledge)
      .catch((err) => this.logger.error(`Failed to update knowledge for user ${userId}:`, err));

    return answer;
  }
}