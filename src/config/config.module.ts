import { Module, Global } from '@nestjs/common';
import { OpenAiProvider } from './openai.config';

@Global()
@Module({
  providers: [OpenAiProvider],
  exports: [OpenAiProvider],
})
export class ConfigModule {}
