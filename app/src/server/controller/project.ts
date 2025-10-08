import type { ElpisContext } from '@elpis/core'
import BaseController from './base'

export default class ProjectController extends BaseController {
  async getGroups(ctx: ElpisContext) {
    const data = await this.service.project.getGroups()
    return this.success(ctx, data)
  }

  async getProjects(ctx: ElpisContext) {
    const { group_id: groupId } = ctx.request.query
    const data = await this.service.project.getProjects(groupId as string)
    return this.success(ctx, data)
  }

  async getProject(ctx: ElpisContext) {
    const { group_id: groupId, project_id: projectId } = ctx.request.query
    const data = await this.service.project.getProject(groupId as string, projectId as string)
    return this.success(ctx, data)
  }
}
