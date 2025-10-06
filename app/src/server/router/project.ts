import { defineRouter } from '@elpis/core'

export default defineRouter((app, router) => {
  const { project: projectController } = app.controller

  router.get('/api/project/groups', projectController.getGroups.bind(projectController))
  router.get('/api/project/projects', projectController.getProjects.bind(projectController))
  router.get('/api/project/project', projectController.getProject.bind(projectController))
})
