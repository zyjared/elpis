import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  const { project: projectController } = app.controller
  router.get('/api/project/list', async (ctx) => {
    const list = await projectController.getList()
    ctx.status = 200
    ctx.body = {
      success: true,
      data: list,
      metadata: {},
    }
  })
}

export default routerModule
