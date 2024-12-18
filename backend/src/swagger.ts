import { OpenAPIV3 } from 'openapi-types';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Excel Backend API',
    version: '1.0.0',
    description: 'API для работы с таблицами, ячейками, стилями ячеек и кастомными формулами',
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
    '/tables/{id}': {
      delete: {
        summary: 'Удалить таблицу по ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'ID таблицы для удаления',
          },
        ],
        responses: {
          '200': {
            description: 'Таблица успешно удалена',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Таблица не найдена',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Ошибка сервера',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
              },
            },
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
    '/cellStyles': {
      get: {
        summary: 'Получить список стилей ячеек таблицы',
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
                      textColor: { type: 'string' },
                      cellColor: { type: 'string' },
                      font: { type: 'string' },
                      borderStyle: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Создать или обновить стиль ячейки',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tableId: { type: 'string' },
                  row: { type: 'integer' },
                  column: { type: 'string' },
                  textColor: { type: 'string' },
                  cellColor: { type: 'string' },
                  font: { type: 'string' },
                  borderStyle: { type: 'string' },
                },
                required: ['tableId', 'row', 'column'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Стиль ячейки создан или обновлён',
          },
        },
      },
    },
  },
};

export default swaggerDocument;