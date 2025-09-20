import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  router.get('/error', async (ctx) => {
    // 测试模板不存在的情况，将重定向
    ctx.render('error')
  })
}

export default routerModule
