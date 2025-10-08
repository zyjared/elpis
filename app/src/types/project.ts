/**
 * 菜单项基础类型
 */
interface BaseMenuItem {
  /** 唯一标识 */
  id: string
  /** 显示名称 */
  title: string
  /** 子菜单 */
  children?: MenuItem[]
}

/**
 * iframe 菜单项
 */
export interface IframeMenuItem extends BaseMenuItem {
  type: 'iframe'
  /** iframe URL */
  url: string
}

/**
 * 自定义路由菜单项
 */
export interface RouteMenuItem extends BaseMenuItem {
  type: 'route'
  /** 路由路径 */
  path?: string
}

/**
 * 嵌套菜单项
 */
export interface NestedMenuItem extends BaseMenuItem {
  type: 'multi'
  /** 子菜单 */
  children: MenuItem[]
}

/**
 * 侧边栏菜单项（可视为嵌套菜单的别名）
 */
export interface SidebarMenuItem extends BaseMenuItem {
  type: 'sidebar'
  path?: string
  menu: MenuItem[]
}

export type MenuItem
  = | IframeMenuItem
    | RouteMenuItem
    | NestedMenuItem
    | SidebarMenuItem

export type Menu = MenuItem[]

/**
 * 项目配置
 */
export interface ProjectConfig {
  /** 项目唯一标识 */
  id: string
  groupId: string
  /** 项目显示名称 */
  title: string
  /** 项目描述 */
  description?: string
  /** 项目菜单配置 */
  menu?: Menu
}

/**
 * 项目模型配置
 */
export interface ProjectModelConfig {
  id: string
  title: string
  description?: string
  /** 项目模型包含的具体项目 */
  projects?: ProjectConfig[]

  /**
   * 前端不会得到
   */
  shared?: ProjectConfig
}
