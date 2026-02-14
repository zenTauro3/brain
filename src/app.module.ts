import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ChatModule],
})
export class AppModule {}
