import type { DashboardModel } from 'docs/dashboard-model'
import type { ModelItem } from 'model'
import type { ControllerModule, ElpisContext } from '../../elpis-core/types'
import buildBaseController from './base'

export interface DtoModel {
  key: string
  name: string
  desc: string
}

export interface DtoProject extends DtoModel {
  homePage: string
}

export interface DtoModelItem {
  model: DtoModel
  project: Record<string, DtoProject>
}

const controller: ControllerModule = (app) => {
  const BaseController = buildBaseController(app)
  return class ProjectController extends BaseController {
    getList(ctx: ElpisContext) {
      return this.success(ctx, this.service.project.getList())
    }

    // 这里的 ctx 是 router 传入的
    update(ctx: ElpisContext) {
      this.app.logger.info('update', ctx.request.body)
      return this.success(ctx, this.service.project.update())
    }

    async getModelList(ctx: ElpisContext) {
      const { project: projectService } = this.app.service
      const modelList = await projectService.getModelList() as ModelItem[]

      const dtmModelList = modelList.reduce((preList, item) => {
        const { model, project } = item

        // dtoModel
        const { key, name, desc } = model
        const dtoModel = { key, name, desc } as DtoModel

        // dtoProject
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey]
          const dtoProject = { key, name, desc, homePage }

          preObj[projKey] = dtoProject
          return preObj
        }, {} as Record<string, any>)

        preList.push({
          model: dtoModel,
          project: dtoProject,
        })

        return preList
      }, [] as DtoModelItem[])

      return this.success(ctx, dtmModelList)
    }
  }
}

export default controller
