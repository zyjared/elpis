import type { ElpisApp, ServiceModule } from '../../elpis-core/types'

const projectService: ServiceModule = (_app: ElpisApp) => {
  return class ProjectService {
    // constructor() {
    //   this.app = app
    // }
    getList() {
      return [
        'a',
        'b',
        'c',
      ]
    }
  }
}

export default projectService
