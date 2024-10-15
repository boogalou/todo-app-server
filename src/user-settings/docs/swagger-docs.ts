import {
  ApiParamOptions,
  ApiResponseOptions,
  ApiOperationOptions,
  ApiBodyOptions,
} from '@nestjs/swagger';

export const getUserSettingsDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Retrieve user settings by their ID',
    description:
      '**This endpoint returns the current settings of the user based on their unique ID**',
  },
  params: [
    <ApiParamOptions>{
      name: 'userId',
      description: 'Unique identifier of the user',
      example: 123,
      type: 'number',
    },
  ],

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: 'Settings successfully returned',
      schema: {
        example: {
          id: 123,
          language: 'eng',
          theme: 'dark',
        },
      },
    },
    <ApiResponseOptions>{
      status: 404,
      description: 'User with the specified ID not found',
    },
  ],
};

export const updateSettingsDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Update user settings',
    description:
      'This operation allows updating the settings for a specific user, including language preferences and theme selection.',
  },

  params: [
    <ApiParamOptions>{
      name: 'userId',
      description: 'Unique identifier of the user whose settings are being updated.',
      example: 123,
      type: 'number',
    },
  ],

  body: <ApiBodyOptions>{
    description:
      'The request body should contain the new settings for the user, including language and theme preferences.',
    schema: {
      type: 'object',
      example: {
        id: 42,
        language: 'rus',
        theme: 'dark',
      },
    },
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: 'Settings successfully updated and returned.',
      schema: {
        example: {
          id: 123,
          language: 'eng',
          theme: 'dark',
        },
      },
    },
  ],
};
