import { defineRouterSchema } from '@elpis/core'

export default defineRouterSchema(
  {
    '/api/example/table': {
      get: {
        query: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              description: '页码',
            },
            pageSize: {
              type: 'string',
              description: '每页条数',
            },
          },
        },
      },
    },
    '/api/example/search': {
      get: {
        query: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '名称',
            },
          },
        },
      },
    },
    '/api/example/add': {
      post: {
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '名称',
              required: true,
            },
            address: {
              type: 'string',
              description: '地址',
              required: true,
            },
          },
        },
      },
    },
    '/api/example/edit': {
      post: {
        body: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID',
              required: true,
            },
            name: {
              type: 'string',
              description: '名称',
            },
            address: {
              type: 'string',
              description: '地址',
            },
          },
        },
      },
    },
  },
)
