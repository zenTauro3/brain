import { Module } from '@nestjs/common';
import { AudioModule } from './modules/audio/audio.module';

@Module({
  imports: [AudioModule],
})
export class AppModule {}
