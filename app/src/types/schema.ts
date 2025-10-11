export type SchemaMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * 根据 table 定义
 *
 * @see https://element-plus.org/zh-CN/component/table#table-column-api
 */
export interface SchemaTableColumn {
  prop: string
  label: string
  width?: string | number
  fixed?: 'left' | 'right' | boolean
  align?: 'left' | 'center' | 'right'
  sortable?: boolean | string
}

/**
 * @see https://element-plus.org/zh-CN/component/table#table-%E5%B1%9E%E6%80%A7
 */
export interface SchemaTableOptions {
  border?: boolean
  stripe?: boolean

}

type ButtonType = 'primary' | 'success' | 'warning' | 'danger'

interface TableButton {
  api: string
  method?: SchemaMethod

  label?: string
  type?: ButtonType
  text?: boolean
  plain?: boolean
}

interface SchemaTableButtonAdd extends TableButton {
  /**
   * 名称
   */
  name?: string
}

interface SchemaTableButtonDelete extends TableButton {
  /**
   * 需要传递哪些字段
   */
  prop?: string

  /**
   * 删除时，显示指定字段作为提示词
   */
  promptProp?: string
}

interface SchemaTableButtonEdit extends TableButton {
  /**
   * 需要哪些字段
   */
  props?: string[]
}

interface SchemaTableButton {
  add?: SchemaTableButtonAdd
  delete?: SchemaTableButtonDelete
  edit?: SchemaTableButtonEdit
}

/**
 *
 */
export interface SchemaTable {
  api: string
  method?: SchemaMethod
  columns: SchemaTableColumn[]
  options: SchemaTableOptions
  buttons?: SchemaTableButton
}

export interface SchemaSearch {
  api: string
  method?: SchemaMethod
}

export interface Schema {
  table?: SchemaTable
  search?: SchemaSearch
}
