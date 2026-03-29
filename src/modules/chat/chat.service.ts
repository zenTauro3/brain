import { Injectable, Logger } from '@nestjs/common';
import { BrainService } from '@modules/brain/brain.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly brainService: BrainService) {}

  async processChat(userId: string, message: string): Promise<string> {
    const userKnowledge = await this.brainService.getUserKnowledge(userId, message);
    this.logger.log(`User knowledge for user ${userId}:`, userKnowledge);

    const answer = await this.brainService.generateAnswer(message, userKnowledge);
    this.logger.log(`Generated answer for user ${userId}:`, answer);
    
    this.brainService
      .processAndSaveKnowledge(userId, message, userKnowledge)
      .then((data) => this.logger.log(`Background knowledge task completed for user ${userId}`, data))
      .catch((err) => this.logger.error(`Background knowledge task failed for user ${userId}:`, err));

    return answer;
  }
}
