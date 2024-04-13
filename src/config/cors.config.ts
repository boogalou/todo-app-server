import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: [/^(http:\/\/localhost:\d{4})?$/],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Access-Control-Allow-Origin'],
  credentials: true,
  maxAge: 3600,
  preflightContinue: false,
};
