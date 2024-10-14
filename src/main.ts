import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { HttpExceptionFilter } from './middleware/HttpExeptionFilter.middleware';
import { ValidationPipe } from '@nestjs/common';
import { LogService } from './logger/log.service';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  app.use(cookieParser());
  const logger = app.get(LogService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3003);
}
bootstrap();
