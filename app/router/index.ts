import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  router.get('/', async (ctx) => {
    ctx.render('index')
  })
}

export default routerModule
