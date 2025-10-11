import type { ElpisApp, ElpisContext } from '@elpis/core'
import BaseController from '@/server/controller/base'

interface ExampleRow {
  id: number
  name: string
  address: string
  createdAt: string
  updatedAt: string
}

const ADDRESS = [
  '北京',
  '上海',
  '广州',
]

const LAST_NAME = ['张', '王', '李', '赵', '孙', '周', '吴', '郑', '冯', '陈']
const FIRST_NAME = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export default class ExampleController extends BaseController {
  data: ExampleRow[] = []
  lastId = 0

  constructor(app: ElpisApp) {
    super(app)
    this.data = Array.from({ length: 100 }, () => this.createRow())
  }

  createRow(item: Partial<ExampleRow> = {}): ExampleRow {
    this.lastId += 1
    const { name, address } = item
    const now = new Date()
      .toISOString()
      .replace('T', ' ')
      .replace(/-/g, '/')
      .slice(0, 19)

    return {
      id: this.lastId,
      name: name || `${LAST_NAME[this.lastId % LAST_NAME.length]}${FIRST_NAME[this.lastId % FIRST_NAME.length]} ${this.lastId}`,
      address: address || ADDRESS[this.lastId % ADDRESS.length] || '',
      createdAt: now,
      updatedAt: now,
    }
  }

  addTableRow(ctx: ElpisContext) {
    const { name, address } = this.getQuery<{ name: string, address: string }>(ctx)
    const row = this.createRow({ name, address })
    this.data.push(row)
    return this.success(ctx, row)
  }

  removeTableRow(ctx: ElpisContext) {
    const { id } = this.getBody<{ id: number }>(ctx)
    if (id) {
      this.data = this.data.filter(item => item.id !== id)
    }
    return this.success(ctx, { id })
  }

  getTableRows(ctx: ElpisContext) {
    const query = this.getQuery(ctx)
    const page = query.page ? +query.page : 1
    const pageSize = query.pageSize ? +query.pageSize : 10

    const { name = '', address = '' } = query as { name?: string, address?: string }

    const data = !name && !address
      ? this.data
      : this.data.filter(item => item.name.includes(name) && item.address.includes(address))

    const offset = (page - 1) * pageSize

    return this.success(
      ctx,
      data.slice(offset, offset + pageSize),
      {
        total: data.length,
      },
    )
  }

  editTableRow(ctx: ElpisContext) {
    const { id: rowId, ...data } = this.getQuery<ExampleRow>(ctx)

    const id = rowId ? +rowId : null

    const row = this.data.find(item => item.id === id)
    row && Object.assign(row, data)

    return this.success(ctx, row)
  }

  searchTableRows(ctx: ElpisContext) {
    const { name = '', address = '' } = this.getQuery<{ name: string, address: string }>(ctx)
    const data = this.data.filter(item => item.name.includes(name) && item.address.includes(address))
    return this.success(ctx, data)
  }
}
