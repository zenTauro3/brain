import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/filters/https-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors(corsConfig);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Axon AI API')
    .setDescription('Documentación técnica del ecosistema Axon')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('config.port')!;

  try {
    await app.listen(port);
    logger.log(`🚀 AXON API: http://192.168.1.137:${port}/api`);
    logger.log(`📚 SWAGGER: http://192.168.1.137:${port}/docs`);
  } catch (error: any) {
    logger.error(`❌ Error starting server: ${error.message}`);
  }
}
bootstrap();
