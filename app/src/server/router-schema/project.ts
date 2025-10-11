import { defineRouterSchema } from '@elpis/core'

export default defineRouterSchema(
  {
    '/api/project/models': {
      get: {
        query: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: '模型 id',
            },
          },
        },
      },
    },
    '/api/project/list': {
      get: {
        query: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: '模型 id',
            },
          },
          required: ['model'],
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
            model: {
              type: 'string',
              description: '模型 id',
            },
            project: {
              type: 'string',
              description: '项目 id',
            },
          },
          required: ['model', 'project'],
        },
      },
    },
    '/api/project/menu': {
      get: {
        query: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: '模型 id',
            },
            project: {
              type: 'string',
              description: '项目 id',
            },
          },
          required: ['model', 'project'],
        },
      },
    },
  },
)
