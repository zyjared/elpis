import type { RouterModule } from '../../elpis-core/types'

const routerModule: RouterModule = (app, router) => {
  const { view } = app.controller
  router.get('/view/:id', view.renderPage.bind(view))
}

export default routerModule
