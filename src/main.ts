import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './infrastructure/configs/swagger.config';
import { HttpExceptionFilter } from './infrastructure/middleware/http-exception-filter.middleware';
import { corsConfig } from './infrastructure/configs/cors.config';
import { ConfigService } from '@nestjs/config';
import { Formatter_Service, Logger_Service } from './shared/tokens';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(corsConfig);
  app.use(cookieParser());
  const logger = app.get(Logger_Service);
  const formatter = app.get(Formatter_Service);
  app.useGlobalFilters(new HttpExceptionFilter(logger, formatter));
  app.setGlobalPrefix('/api/v1');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
