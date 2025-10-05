import { defineRouterSchema } from '@elpis/core'

export default defineRouterSchema(
  {
    '/api/project/model_list': {
      get: {},
    },
    '/api/project/project_list': {
      get: {
        query: {
          type: 'object',
          properties: {
            model_key: {
              type: 'string',
              description: '模型 key',
            },
          },
        },
        body: {},
        params: {},
      },
    },
    '/api/project': {
      get: {
        query: {
          type: 'object',
          properties: {
            proj_key: {
              type: 'string',
              description: '项目 key',
            },
          },
          required: ['proj_key'],
        },
      },
    },
  },
)
