import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Todo app API')
  .setDescription('The task manager app description')
  .setVersion('1.0')
  .addTag('')
  .build();
