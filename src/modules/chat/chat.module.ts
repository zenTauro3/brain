import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { BrainModule } from '@modules/brain/brain.module'; 

@Module({
  imports: [
    BrainModule, 
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}