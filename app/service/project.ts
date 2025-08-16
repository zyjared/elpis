import type { ElpisApp, ServiceModule } from '../../elpis-core/types'
import { loadModel } from '../../model'

import buildBaseService from './base'

const projectService: ServiceModule = (_app: ElpisApp) => {
  const BaseService = buildBaseService(_app)
  const modelList = loadModel(_app)

  return class ProjectService extends BaseService {
    getList() {
      return [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]
    }

    update() {
      return {
        'test ': '测试 post 成功',
      }
    }

    getModelList() {
      return modelList
    }
  }
}

export default projectService
