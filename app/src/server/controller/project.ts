import type { ElpisContext } from '@elpis/core'
import BaseController from './base'

interface GetModelsParams {
  model?: string
}

interface GetProjectParams {
  model: string
  project?: string
}

export default class ProjectController extends BaseController {
  async getModels(ctx: ElpisContext) {
    const data = await this.service.project.getModels()
    return this.success(ctx, data)
    // return this.success(ctx, data.map((model) => {
    //   const {
    //     id,
    //     title,
    //     description,
    //     projects,
    //   } = model
    //   return {
    //     id,
    //     title,
    //     description,
    //     projects: projects?.map((project) => {
    //       return {
    //         id: project.id,
    //         title: project.title,
    //         description: project.description,
    //       }
    //     }) || [],
    //   }
    // }))
  }

  async getProjects(ctx: ElpisContext) {
    const { model: modelId } = this.getQuery<GetModelsParams>(ctx)
    const data = await this.service.project.getProjects(modelId)
    return this.success(ctx, data)
  }

  async getProject(ctx: ElpisContext) {
    const { model: modelId, project: projectId } = this.getQuery<GetProjectParams>(ctx)
    const data = await this.service.project.getProject(modelId, projectId)
    return this.success(ctx, data)
  }

  async getMenu(ctx: ElpisContext) {
    const { model: modelId, project: projectId } = this.getQuery<Required<GetProjectParams>>(ctx)
    const menu = await this.service.project.getMenu(modelId, projectId)
    return this.success(ctx, menu)
  }
}
