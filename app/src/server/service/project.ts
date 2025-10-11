import type { ElpisApp } from '@elpis/core'
import type { ProjectModelConfig } from '@/types'
import { loadProjects } from '../model/project/index'
import BaseService from './base'

export default class ProjectService extends BaseService {
  private _models: ProjectModelConfig[] | null = null

  constructor(app: ElpisApp) {
    super(app)
  }

  /**
   * 获得项目模型列表
   */
  async getModels() {
    if (!this._models) {
      this._models = await loadProjects(this.app)
    }

    return this._models
  }

  /**
   * 获得项目模型下的项目列表
   */
  async getProjects(modelId?: string) {
    const models = await this.getModels()
    return (
      modelId
        ? models.find(model => model.id === modelId)?.projects
        : models[0]?.projects
    ) || []
  }

  /**
   * 获得项目模型下的指定项目
   */
  async getProject(modelId: string, projectId?: string) {
    const projects = await this.getProjects(modelId)
    return projectId
      ? projects?.find(project => project.id === projectId)
      : projects[0]
  }

  /**
   * 获得项目模型下的指定菜单
   */
  async getMenu(modelId: string, projectId: string) {
    const project = await this.getProject(modelId, projectId)
    return project?.menu
  }
}
