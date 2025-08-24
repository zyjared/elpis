import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import { getDevConfig } from '../app/webpack/webpack.dev'
import { Elpis } from '../elpis-core'

const elpis = new Elpis()

elpis.start({
  baseDir: './',
  serverDir: './server',
  publicDir: './public',
  server: {
    dynamicPort: false,
  },
  onDev: async (app) => {
    const config = await getDevConfig({
      outputDir: './public',
    })

    const compiler = Webpack(config)

    if (!compiler) {
      throw new Error('compiler is not defined')
    }

    const devMiddleware = WebpackDevMiddleware(compiler, {
      publicPath: '/',
      stats: 'minimal',
    })

    const hotMiddleware = WebpackHotMiddleware(compiler, {
      path: '/__webpack_hmr',
      timeout: 20000,
      reload: true,
    })

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
