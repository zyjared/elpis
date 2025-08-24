import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  const { project: projectController } = app.controller

  router.get('/api/project/model_list', projectController.getModelList.bind(projectController))
  router.get('/api/project/project_list', projectController.getProjectList.bind(projectController))
  router.get('/api/project', projectController.getProject.bind(projectController))
}

export default routerModule
