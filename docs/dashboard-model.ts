interface BaseMenuItem {
  /**
   * 菜单唯一描述
   */
  key: string

  /**
   * 菜单名称
   */
  name: string
}

interface IframeConfig {
  path: string
}

interface SchemaConfigSchema<T> {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array' | 'null'
  properties: Record<string, SchemaConfigSchema<T> & T>
}

interface SchemaProperty {
  label: string
  type: string
}
interface SchemaConfig {
  api: string
  schema: SchemaConfigSchema<SchemaProperty>
  tableConfig: Record<string, unknown>
  searchConfig: Record<string, unknown>
  components: Record<string, unknown>
}

interface CustomConfig {
  path: string
}

interface SiderConfig {
  menu: Array<ModuleMenuItem<'iframe'> | ModuleMenuItem<'schema'> | ModuleMenuItem<'custom'>>
}

interface ModuleConfigMap {
  iframe: IframeConfig
  schema: SchemaConfig
  custom: CustomConfig
  sider: SiderConfig
}

type ModuleMenuItem<T extends keyof ModuleConfigMap> = BaseMenuItem & {
  menuType?: 'module'
  moduleType?: T
} & {
  [K in `${T}Config`]?: ModuleConfigMap[T]
}

type AnyModuleMenuItem
    = | ModuleMenuItem<'iframe'>
      | ModuleMenuItem<'schema'>
      | ModuleMenuItem<'custom'>
      | ModuleMenuItem<'sider'>

interface GroupMenuItem extends BaseMenuItem {
  menuType: 'group'
  subMenu: Array<AnyModuleMenuItem | GroupMenuItem>
}

export interface DashboardModel {
  key?: string
  mode: 'dashboard'
  name: string
  desc?: string
  homePage?: string
  menu: Array<GroupMenuItem | AnyModuleMenuItem>
}

// 示例用法
export const exampleModel: DashboardModel = {
  mode: 'dashboard',
  name: 'Dashboard',
  menu: [
    {
      key: 'dashboard',
      name: 'Dashboard',
      menuType: 'module',
      moduleType: 'iframe',
      iframeConfig: {
        path: '/dashboard',
      },
    },
    {
      key: 'schema-example',
      name: 'Schema Example',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/schema',
        schema: {
          type: 'object',
          properties: {
            name: {
              label: 'Name',
              type: 'string',
              properties: {},
            },
            age: {
              label: 'Age',
              type: 'number',
              properties: {},
            },
          },
        },
        tableConfig: {},
        searchConfig: {},
        components: {},
      },
    },
    {
      key: 'group-example',
      name: 'Group Example',
      menuType: 'group',
      subMenu: [],
    },
  ],
}
