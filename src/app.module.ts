import { Module } from '@nestjs/common';
import { AudioModule } from './modules/audio/audio.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [AudioModule, ChatModule],
})
export class AppModule {}
