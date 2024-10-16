import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { HttpExceptionFilter } from './middleware/HttpExeptionFilter.middleware';
import { LogService } from './logger/log.service';
import { corsConfig } from './config/cors.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(corsConfig);
  app.use(cookieParser());
  const logger = app.get(LogService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
