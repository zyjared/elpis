import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import { getDevConfig } from './app/webpack/config/webpack.dev'
import { Elpis } from './elpis-core'

const elpis = new Elpis()

elpis.start({
  baseDir: './',
  serverDir: './server',
  publicDir: './public',
  onDev: async (app) => {
    const config = await getDevConfig({
      outputDir: './public',
    })

    const compiler = Webpack(config)

    if (!compiler) {
      throw new Error('compiler is not defined')
    }

    // webpack-dev-middleware - 必须在热重载之前
    const devMiddleware = WebpackDevMiddleware(compiler, {
      publicPath: '/',
      stats: 'minimal',
    })

    // webpack-hot-middleware - 必须在dev-middleware之后
    const hotMiddleware = WebpackHotMiddleware(compiler, {
      path: '/__webpack_hmr',
      timeout: 20000,
      reload: true,
    })

    // 先加载dev-middleware
    app.use(async (ctx, next) => {
      if (ctx.body || ctx.res.headersSent) {
        return await next()
      }

      return new Promise<void>((resolve, reject) => {
        devMiddleware(ctx.req, ctx.res, (err: any) => {
          if (err) {
            reject(err)
            return
          }

          if (ctx.body || ctx.res.headersSent) {
            resolve()
          }
          else {
            next().then(() => resolve()).catch(reject)
          }
        })
      })
    })

    // 再加载热重载中间件
    app.use(async (ctx, next) => {
      if (ctx.body || ctx.res.headersSent) {
        return await next()
      }

      return new Promise<void>((resolve, reject) => {
        hotMiddleware(ctx.req, ctx.res, (err: any) => {
          if (err) {
            reject(err)
            return
          }

          if (ctx.body || ctx.res.headersSent) {
            resolve()
          }
          else {
            next().then(() => resolve()).catch(reject)
          }
        })
      })
    })
  },
})
