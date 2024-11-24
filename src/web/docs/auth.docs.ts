import { ApiBodyOptions, ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export const registrationDocs = {
  operation: <ApiOperationOptions>{
    summary: 'User Registration',
    description:
      '**Registers a new user by providing username, email, password, and password confirmation. The system verifies that all fields are valid and that the password matches the confirmation.**',
  },

  body: <ApiBodyOptions>{
    description:
      '**User registration payload containing the necessary details for account creation.**',
    schema: {
      type: 'object',
      example: {
        username: 'John Doe',
        email: 'johndoe@mail.xyz',
        password: '1aB@cD',
        confirmPassword: '1aB@cD',
      },
    },
  },

  responses: [
    <ApiResponseOptions>{
      status: 201,
      description: '**User successfully registered and account created.**',
    },
  ],
};

export const loginDocs = {
  operation: <ApiOperationOptions>{
    summary: 'User Login',
    description:
      '**Logs in an existing user by verifying their email and password. If the credentials are correct, the system responds with user details and an access token for authentication.**',
  },

  body: <ApiBodyOptions>{
    description: '**User login payload containing email and password for authentication.**',
    schema: {
      type: 'object',
      example: {
        email: 'johndoe@mail.xyz',
        password: '1aB@cD',
      },
    },
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '**User successfully authenticated. Returns user details and an access token.**',
      schema: {
        type: 'object',
        example: {
          id: 13,
          username: 'John Doe',
          email: 'johndoe@mail.xyz',
          userPic: 'https://site.com/images/img.png',
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlcjM0QG1haWwueHl6IiwiaWF0IjoxNzI4OTQ0OTc3LCJleHAiOjE3Mjg5NDg1Nzd9.8Z1FRpoPNeV56LVpK3rEWRf44aHlNMQTG6_TP2_d-o0',
        },
      },
    },
  ],
};

export const refreshTokensDocs = {
  operation: <ApiOperationOptions>{
    summary:
      'Handles token refresh requests by issuing a new access token for the authenticated user.',
    description:
      '**This operation allows authenticated users to refresh their access token using a valid refresh token. Upon success, it returns user details and a new access token. The new access token can be used to access protected resources without needing to log in again.**',
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '**User successfully authenticated. Returns user details and an access token.**',
      schema: {
        type: 'object',
        example: {
          id: 13,
          username: 'John Doe',
          email: 'johndoe@mail.xyz',
          userPic: 'https://site.com/images/img.png',
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlcjM0QG1haWwueHl6IiwiaWF0IjoxNzI4OTQ0OTc3LCJleHAiOjE3Mjg5NDg1Nzd9.8Z1FRpoPNeV56LVpK3rEWRf44aHlNMQTG6_TP2_d-o0',
        },
      },
    },
  ],
};

export const logoutDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Logs the user out and invalidates the current session.',
    description:
      "**This operation handles the user logout process by invalidating the user's session and refresh token. Once successfully logged out, the user will need to authenticate again to regain access to protected resources. No content is returned upon success.**",
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '** **',
      schema: {
        type: 'object',
        example: {},
      },
    },
  ],
};
