import { ApiParamOptions, ApiResponseOptions, ApiOperationOptions } from '@nestjs/swagger';

export const getUserSettingsDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Получить настройки пользователя по его ID',
    description:
      'Этот эндпоинт возвращает текущие настройки пользователя на основе его уникального ID.',
  },
  param: <ApiParamOptions>{
    name: 'userId',
    description: 'Уникальный идентификатор пользователя',
    example: 123,
    type: 'number',
  },
  response200: <ApiResponseOptions>{
    status: 200,
    description: 'Настройки успешно возвращены',
    schema: {
      example: {
        id: 123,
        language: 'eng',
        theme: 'dark',
      },
    },
  },
  response404: <ApiResponseOptions>{
    status: 404,
    description: 'Пользователь с указанным ID не найден',
  },
};
