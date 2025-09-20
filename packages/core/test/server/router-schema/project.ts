import { defineRouterSchema } from '../../../src'

export default defineRouterSchema(
  {
    '/api/project/model_list': {
      get: {},
    },
    '/api/project/project_list': {
      get: {
        query: {
          type: 'object',
          a: false,
          properties: {
            model_key: {
              type: 'string',
              description: '模型 key',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            a: {
              type: 'string',
            },
          },
        },
        params: {},
      },
    },
  },
)
