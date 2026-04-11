import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/filters/https-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { corsConfig } from './config/cors.config';

import * as os from 'os';

function getNetworkIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (iface.address.startsWith('192.168') || iface.address.startsWith('10.')) {
          return iface.address;
        }
      }
    }
  }
  return '127.0.0.1';
}

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

  const port = configService.get<number>('config.port') || 3000;
  
  const localIp = getNetworkIP();

  try {
    await app.listen(port, '0.0.0.0');
    
    logger.log(`🚀 AXON API: http://${localIp}:${port}/api`);
    logger.log(`📚 SWAGGER: http://${localIp}:${port}/docs`);
  } catch (error: any) {
    logger.error(`❌ Error starting server: ${error.message}`);
  }
}
bootstrap();