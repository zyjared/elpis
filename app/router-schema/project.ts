import type { RouterSchemaModule } from '../../elpis-core/types'

const projectSchema: RouterSchemaModule = {
  '/api/project/list': {
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
      body: {},
      params: {},
    },
  },
}

export default projectSchema
