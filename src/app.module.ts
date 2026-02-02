import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { FactsModule } from './modules/facts/facts.module';
import { MemoriesModule } from './modules/memories/memories.module';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    FactsModule,
    MemoriesModule,
    ChatModule,
  ],
})
export class AppModule {}
