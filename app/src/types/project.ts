/**
 * 菜单项基础类型
 */
interface BaseMenuItem {
  /** 唯一标识 */
  id: string
  /** 显示名称 */
  name: string
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
  path: string
  /** 路由元数据（可选） */
  meta?: {
    icon?: string
    permissions?: string[]
  }
}

/**
 * 嵌套菜单项
 */
export interface NestedMenuItem extends BaseMenuItem {
  type: 'nested'
  /** 子菜单 */
  children: MenuItem[]
}

/**
 * 侧边栏菜单项（可视为嵌套菜单的别名）
 */
export interface SidebarMenuItem extends BaseMenuItem {
  type: 'sidebar'
  children: MenuItem[]
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
 * 项目组配置
 */
export interface ProjectGroupConfig {
  id: string
  /** 项目组包含的具体项目 */
  projects: ProjectConfig[]
}
