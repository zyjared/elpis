import type { ControllerModule, ElpisContext } from '../../elpis-core/types'
import buildBaseController from './base'

const controller: ControllerModule = (app) => {
  const BaseController = buildBaseController(app)
  return class ProjectController extends BaseController {
    getList() {
      return this.service.project.getList()
    }

    // 这里的 ctx 是 router 传入的
    update(ctx: ElpisContext) {
      this.app.logger.info('update', ctx.request.body)
      return this.service.project.update()
    }
  }
}

export default controller
