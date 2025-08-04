import type { ElpisApp, ServiceModule } from '../../elpis-core/types'
import superagent from 'superagent'

const service: ServiceModule = (app) => {
  return class BaseService {
    app: ElpisApp
    config: ElpisApp['config']
    curl: typeof superagent

    constructor() {
      this.app = app
      this.config = app.config
      this.curl = superagent
    }
  }
}

export default service
