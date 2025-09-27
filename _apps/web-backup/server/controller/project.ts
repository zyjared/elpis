import type { ControllerModule, ElpisContext } from '../../elpis-core/types'
import type { DtoModel, DtoModelItem, DtoProject } from '../../types/model'
import type { DashboardModel, ModelItem } from '../model'
import buildBaseController from './base'

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

    getRawModelList(ctx: ElpisContext) {
      const { project: projectService } = this.app.service
      const modelList = projectService.getModelList() as ModelItem[]
      return this.success(ctx, modelList)
    }

    /**
     * 获得所有模型的列表数据
     */
    getModelList(ctx: ElpisContext) {
      const { project: projectService } = this.app.service
      const modelList = projectService.getModelList() as ModelItem[]

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

    /**
     * 获得 model_key 对应模型下的项目列表
     */
    getProjectList(ctx: ElpisContext) {
      const {
        model_key: modelKey,
      } = ctx.request.query

      const { project: projectService } = this.app.service
      const projectList = projectService.getProjectList({ modelKey }) as DashboardModel[]

      const dtoProjectList = projectList.map((item) => {
        const { key, name, desc, homePage, modelKey } = item
        return { key, name, desc, homePage, modelKey }
      })

      return this.success(ctx, dtoProjectList)
    }

    getProject(ctx: ElpisContext) {
      const {
        proj_key: projKey,
      } = ctx.request.query

      const { project: projectService } = this.app.service
      const project = projectService.getProject({ projKey }) as DashboardModel | null
      if (!project) {
        return this.fail(ctx, '项目不存在')
      }

      const dtoProject = {
        modelKey: project.modelKey,
        key: project.key,
        name: project.name,
        desc: project.desc,
        homePage: project.homePage,
      } as DtoProject

      return this.success(ctx, project)
    }
  }
}

export default controller
