import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  router.get('/view/:id', async (ctx) => {
    const pageName = ctx.params.id
    ctx.render(pageName)
  })
}

export default routerModule
