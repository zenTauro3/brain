import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { UnauthorizedException } from '@nestjs/common';

const whitelist = ['http://localhost:8081', 'http://localhost:3000', 'https://admin.axon-ai.com'];

export const corsConfig: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new UnauthorizedException('Bloqueado por CORS cabrón.'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
};
