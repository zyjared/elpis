import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  router.get('/', async (ctx) => {
    ctx.render('entry.page1')
  })
}

export default routerModule
