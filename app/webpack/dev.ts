import process from 'node:process'
import { Command } from 'commander'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { getDevConfig } from './config/webpack.dev'

const program = new Command()

program
  .option('--host <host>', 'host', '127.0.0.1')
  .option('--port <port>', 'port', '9000')
  .option('--open <open>', 'open', false)
  .parse(process.argv)
  .action((options) => {
    serve(options)
  })

program.parse()

/**
 * 使用 api 启动 devServer，支持热更新
 * @see https://webpack.docschina.org/api/webpack-dev-server/
 */
async function serve(options: WebpackDevServer.Configuration = {}) {
  const config = await getDevConfig()
  const compiler = Webpack(config)

  // 可能为 null
  if (!compiler) {
    console.error('[dev] compiler is null')
    return
  }

  const serverConfig = {
    ...config.devServer,
    ...options,
  }

  const server = new WebpackDevServer(serverConfig, compiler)

  server.startCallback((err) => {
    if (err) {
      console.error(err)
      return
    }
    // eslint-disable-next-line no-console
    console.log(`server is running: http://${serverConfig.host}:${serverConfig.port}`)
  })
}
