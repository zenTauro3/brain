import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalHttpExceptionFilter } from './common/filters/https-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const port = configService.get<number>('PORT') ?? 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  await app.listen(port);
  
  console.log('-------------------------------------------------------');
  console.log(`🚀 AXON API is running on: http://localhost:${port}`);
  console.log(`📡 Environment: ${nodeEnv}`);
  console.log('-------------------------------------------------------');
}

bootstrap();