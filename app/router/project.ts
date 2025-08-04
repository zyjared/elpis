import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  const { project: projectController } = app.controller
  router.get('/api/project/list', async (ctx) => {
    const list = await projectController.getList(ctx)
    projectController.success(ctx, list)
  })

  router.post('/api/project/update', async (ctx) => {
    const data = await projectController.update(ctx)
    projectController.success(ctx, data)
  })
}

export default routerModule
