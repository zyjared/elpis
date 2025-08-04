import type { ControllerModule } from '../../elpis-core/types'

const controller: ControllerModule = (app) => {
  return class {
    getList() {
      return app.service.project.getList()
    }
  }
}

export default controller
