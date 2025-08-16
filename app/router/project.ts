import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  const { project: projectController } = app.controller
  router.get('/api/project/list', projectController.getList.bind(projectController))

  router.post('/api/project/update', projectController.update.bind(projectController))

  router.get('/api/project/model_list', projectController.getModelList.bind(projectController))
}

export default routerModule
