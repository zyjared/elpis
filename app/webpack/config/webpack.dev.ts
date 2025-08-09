import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import path from 'node:path'
import { merge } from 'webpack-merge'
import { getCommonConfig } from './webpack.common'

/**
 * 支持 devServer 的配置
 */
interface DevConfig extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

export async function getDevConfig() {
  const commonConfig = await getCommonConfig()

  return merge<DevConfig>(commonConfig, {
    mode: 'development',
    devServer: {
      static: {
        directory: path.resolve('dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    performance: {
      hints: false,
    },
    plugins: [
    // 进度插件
    //   new Webpack.ProgressPlugin({
    //     modules: true,
    //     modulesCount: 500,
    //     profile: true,
    //   }),
    ],
  })
}
