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

export interface SchemaConfigSchema<T> {
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
  menu: Array<
    ModuleMenuItem<'iframe'>
    | ModuleMenuItem<'schema'>
    | ModuleMenuItem<'custom'>
    | GroupMenuItem
   >
}

interface ModuleConfigMap {
  iframe: IframeConfig
  schema: SchemaConfig
  custom: CustomConfig
  sider: SiderConfig
}

export type ModuleMenuItem<T extends keyof ModuleConfigMap> = BaseMenuItem & {
  menuType?: 'module'
  moduleType?: T
} & {
  [K in `${T}Config`]?: ModuleConfigMap[T]
}

export type AnyModuleMenuItem
          = | ModuleMenuItem<'iframe'>
            | ModuleMenuItem<'schema'>
            | ModuleMenuItem<'custom'>
            | ModuleMenuItem<'sider'>

export interface GroupMenuItem extends BaseMenuItem {
  menuType: 'group'
  subMenu: Array<AnyModuleMenuItem | GroupMenuItem>
}

export type ModelMenuItem = AnyModuleMenuItem | GroupMenuItem

export interface DashboardModel {
  key?: string
  modelKey?: string
  mode: 'dashboard'
  name: string
  desc?: string
  homePage?: string
  menu: Array<ModelMenuItem>
}

export interface DtoModel {
  key: string
  name: string
  desc: string
  modelKey?: string
}

export interface DtoProject extends DtoModel {
  homePage: string
  menu: ModelMenuItem[]
}

export interface DtoModelItem {
  model: DtoModel
  project: Record<string, DtoProject>
}
