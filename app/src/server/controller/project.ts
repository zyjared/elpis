import type { ElpisContext } from '@elpis/core'
import BaseController from './base'

export default class ProjectController extends BaseController {
  async getModels(ctx: ElpisContext) {
    const data = await this.service.project.getModels()
    return this.success(ctx, data)
  }

  async getProjects(ctx: ElpisContext) {
    const { model_id: modelId } = ctx.request.query
    const data = await this.service.project.getProjects(modelId as string)
    return this.success(ctx, data)
  }

  async getProject(ctx: ElpisContext) {
    const { model_id: modelId, project_id: projectId } = ctx.request.query
    const data = await this.service.project.getProject(modelId as string, projectId as string)
    return this.success(ctx, data)
  }
}
