import { defineRouter } from '@elpis/core'

export default defineRouter((app, router) => {
  const { project: projectController } = app.controller

  router.get('/api/project/models', projectController.getModels.bind(projectController))
  router.get('/api/project/list', projectController.getProjects.bind(projectController))
  router.get('/api/project/detail', projectController.getProject.bind(projectController))
  router.get('/api/project/menu', projectController.getMenu.bind(projectController))
})
