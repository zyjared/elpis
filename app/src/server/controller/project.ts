import type { ElpisContext } from '@elpis/core'
import BaseController from './base'

export default class ProjectController extends BaseController {
  getGroups(ctx: ElpisContext) {
    const data = this.service.project.getGroups()
    return this.success(ctx, data)
  }

  getProjects(ctx: ElpisContext) {
    const { group_id: groupId } = ctx.request.query
    const data = this.service.project.getProjects(groupId as string)
    return this.success(ctx, data)
  }

  getProject(ctx: ElpisContext) {
    const { group_id: groupId, project_id: projectId } = ctx.request.query
    const data = this.service.project.getProject(groupId as string, projectId as string)
    return this.success(ctx, data)
  }
}
