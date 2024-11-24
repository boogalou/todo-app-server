import {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiResponseOptions,
} from '@nestjs/swagger';

export const createTaskDocs = {
  operation: <ApiOperationOptions>{
    summary: `Create a new task`,
    description: '**This endpoint creates end returns a new task**',
  },

  param: <ApiParamOptions>{
    name: 'userId',
    description: '**Unique user identifier**',
    example: 42,
    type: 'number',
  },

  body: <ApiBodyOptions>{
    description: '**Task object that needs to be created**',
    schema: {
      type: 'object',
      example: {
        title: 'React',
        description: 'Learn React',
        color: '#FFF',
        category: 'Education',
        dueDate: '2024-08-17T22:42:00.000Z',
        isCompleted: false,
      },
    },
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '**Task returned successfully**',
      schema: {
        type: 'object',
        example: {
          id: 42,
          title: 'React',
          description: 'Learn React',
          color: '#FFF',
          category: 'Education',
          dueDate: '2024-08-17T22:42:00.000Z',
          isCompleted: false,
          createdAt: '2024-10-13T11:56:51.776Z',
          updatedAt: '2024-10-13T11:56:51.776Z',
        },
      },
    },

    <ApiResponseOptions>{
      status: 500,
      description: `**Failed to save task**`,
    },
  ],
};

export const getTasksDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Retrieve a list of all tasks',
    description: '**This endpoint returns a list of tasks for a user by their unique identifier.**',
  },

  param: <ApiParamOptions>{
    name: 'userId',
    description: '**Unique user identifier**',
    example: 42,
    type: 'number',
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '**Task returned successfully**',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 42 },
            title: { type: 'string', example: 'React' },
            description: { type: 'string', example: 'Learn React' },
            color: { type: 'string', example: '#FFF' },
            category: { type: 'string', example: 'Education' },
            dueDate: { type: 'string', format: 'date-time', example: '2024-08-17T22:42:00.000Z' },
            isCompleted: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2024-10-13T11:56:51.776Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-10-13T11:56:51.776Z' },
          },
        },
      },
    },
  ],
};

export const updateTaskDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Edit a task',
    description: '**This endpoint edits a task by its unique identifier**',
  },

  params: [
    <ApiParamOptions>{
      name: 'userId',
      description: 'Unique user identifier',
      example: 42,
      type: 'number',
    },
    <ApiParamOptions>{
      name: 'taskId',
      description: 'Unique task identifier',
      example: 11,
      type: 'number',
    },
  ],

  body: <ApiBodyOptions>{
    description: '**Task object that needs to be edited**',
    schema: {
      type: 'object',
      example: {
        id: 13,
        title: 'React',
        description: 'Learn React',
        color: '#FFF',
        category: 'Education',
        dueDate: '2024-08-17T22:42:00.000Z',
        isCompleted: false,
      },
    },
  },

  responses: [
    <ApiResponseOptions>{
      status: 200,
      description: '**Task returned successfully**',
      schema: {
        type: 'object',
        example: {
          id: 13,
          title: 'React',
          description: 'Learn React',
          color: '#FFF',
          category: 'Education',
          dueDate: '2024-08-17T22:42:00.000Z',
          isCompleted: false,
          createdAt: '2024-10-13T11:56:51.776Z',
          updatedAt: '2024-10-13T11:56:51.776Z',
        },
      },
    },

    <ApiResponseOptions>{
      status: 404,
      description: 'Failed to find task',
    },
  ],
};

export const deleteTaskDocs = {
  operation: <ApiOperationOptions>{
    summary: 'Delete a task',
    description: '**This endpoint deletes a task by its unique identifier**',
  },

  params: [
    <ApiParamOptions>{
      name: 'userId',
      description: '**Unique user identifier**',
      example: 42,
      type: 'number',
    },
    <ApiParamOptions>{
      name: 'taskId',
      description: '**Unique task identifier**',
      example: 11,
      type: 'number',
    },
  ],

  responses: [
    <ApiResponseOptions>{
      status: 204,
      description: '**Task deleted successfully**',
    },
    <ApiResponseOptions>{
      status: 404,
      description: '**Task not found**',
    },
    <ApiResponseOptions>{
      status: 500,
      description: '**Failed to delete task**',
    },
  ],
};
