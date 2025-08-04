import type { ElpisApp, ServiceModule } from '../../elpis-core/types'
import buildBaseService from './base'

const projectService: ServiceModule = (_app: ElpisApp) => {
  const BaseService = buildBaseService(_app)
  return class ProjectService extends BaseService {
    getList() {
      return [
        'a',
        'b',
        'c',
      ]
    }

    update() {
      return {
        'test ': '测试 post 成功',
      }
    }
  }
}

export default projectService
