import type { ElpisApp } from '@elpis/core'
import superagent from 'superagent'

export default class BaseService {
  app: ElpisApp
  options: ElpisApp['options']
  curl: typeof superagent

  constructor(app: ElpisApp) {
    this.app = app
    this.options = app.options
    this.curl = superagent
  }
}
