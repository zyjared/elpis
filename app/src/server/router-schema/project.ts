import { defineRouterSchema } from '@elpis/core'

export default defineRouterSchema(
  {
    '/api/project/groups': {
      get: {},
    },
    '/api/project/list': {
      get: {
        query: {
          type: 'object',
          properties: {
            group_id: {
              type: 'string',
              description: '分组 id',
            },
          },
        },
        body: {},
        params: {},
      },
    },
    '/api/project/detail': {
      get: {
        query: {
          type: 'object',
          properties: {
            project_id: {
              type: 'string',
              description: '项目 id',
            },
          },
          required: ['project_id'],
        },
      },
    },
  },
)
