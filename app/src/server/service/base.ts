import type { ElpisApp } from '@elpis/core'
import { defineService } from '@elpis/core'
import superagent from 'superagent'

export default defineService((app) => {
  return class BaseService {
    app: ElpisApp
    options: ElpisApp['options']
    curl: typeof superagent

    constructor() {
      this.app = app
      this.options = app.options
      this.curl = superagent
    }
  }
})
