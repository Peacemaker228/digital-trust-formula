import { OpenAPIV3 } from 'openapi-types';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Excel Backend API',
    version: '1.0.0',
    description: 'API для работы с таблицами, ячейками и кастомными формулами',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local server',
    },
  ],
  paths: {
    '/tables': {
      get: {
        summary: 'Получить список таблиц',
        responses: {
          '200': {
            description: 'Успешно',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Создать новую таблицу',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                },
                required: ['name'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Таблица создана',
          },
        },
      },
    },
    '/formulas': {
      get: {
        summary: 'Получить список кастомных формул',
        responses: {
          '200': {
            description: 'Успешно',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      implementation: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Создать кастомную формулу',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  implementation: { type: 'string' },
                },
                required: ['name', 'implementation'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Формула создана',
          },
        },
      },
    },
    '/cells': {
      get: {
        summary: 'Получить список ячеек таблицы',
        parameters: [
          {
            name: 'table_id',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'ID таблицы',
          },
        ],
        responses: {
          '200': {
            description: 'Успешно',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      tableId: { type: 'string' },
                      row: { type: 'integer' },
                      column: { type: 'string' },
                      value: { type: 'string' },
                      formula: { type: 'string' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Создать или обновить ячейку',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tableId: { type: 'string' },
                  row: { type: 'integer' },
                  column: { type: 'string' },
                  value: { type: 'string' },
                  formula: { type: 'string' },
                },
                required: ['tableId', 'row', 'column'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ячейка создана или обновлена',
          },
        },
      },
    },
  },
};

export default swaggerDocument;