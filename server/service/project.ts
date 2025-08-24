import type { ElpisApp, ServiceModule } from '../../elpis-core/types'
import type { ModelItem } from '../model'
import type { DashboardModel } from '~/types/model'
import { loadModel } from '../model'

import buildBaseService from './base'

const projectService: ServiceModule = (_app: ElpisApp) => {
  const BaseService = buildBaseService(_app)

  // FIXME: 一定能拿到，但反直觉
  // loader 的类型与处理方式待完善
  let modelList: ModelItem[] = []
  loadModel(_app).then(list => modelList = list)

  return class ProjectService extends BaseService {
    getList() {
      return [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]
    }

    update() {
      return {
        'test ': '测试 post 成功',
      }
    }

    /**
     * 获得所有 model 列表
     */
    getModelList() {
      return modelList
    }

    /**
     * 获得 modelKey 对应的模型数据列表,
     * 没有 modelKey 时取全量
     */
    getProjectList(options: {
      modelKey?: string
    } = {}) {
      const { modelKey } = options

      if (modelKey) {
        const modelItem = modelList.find(it => it.model.key === modelKey)
        return modelItem
          ? Object.values(modelItem.project)
          : []
      }

      // 全量
      return modelList.reduce(
        (items, item) => items.concat(Object.values(item.project)),
        [] as DashboardModel[],
      )
    }

    getProject(options: {
      projKey: string
    }) {
      const { projKey } = options

      for (const modelItem of modelList) {
        const projectItem = modelItem.project[projKey]
        if (projectItem) {
          return projectItem
        }
      }

      return null
    }
  }
}

export default projectService
