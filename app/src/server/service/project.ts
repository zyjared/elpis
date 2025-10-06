import type { ElpisApp } from '@elpis/core'
import type { ProjectGroupConfig } from '@/types'
import { loadProjects } from '../model/project/index'
import BaseService from './base'

export default class ProjectService extends BaseService {
  private _groups: ProjectGroupConfig[] | null = null

  constructor(app: ElpisApp) {
    super(app)
  }

  /**
   * 获得项目分组列表
   */
  async getGroups() {
    if (!this._groups) {
      this._groups = await loadProjects(this.app)
    }

    return this._groups
  }

  /**
   * 获得项目列表
   */
  async getProjects(groupId?: string) {
    const groups = await this.getGroups()
    return (
      groupId
        ? groups.find(group => group.id === groupId)?.projects
        : groups[0]?.projects
    ) || []
  }

  /**
   * 获得项目
   */
  async getProject(groupId: string, projectId?: string) {
    const projects = await this.getProjects(groupId)
    return projectId
      ? projects?.find(project => project.id === projectId)
      : projects[0]
  }
}
