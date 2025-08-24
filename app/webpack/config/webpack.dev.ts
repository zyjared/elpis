import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import path from 'node:path'
import Webpack from 'webpack'
import { merge } from 'webpack-merge'
import { getCommonConfig } from './webpack.common'

/**
 * 支持 devServer 的配置
 */
interface DevConfig extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

export async function getDevConfig(options: {
  outputDir?: string
} = {}) {
  const {
    outputDir = './dist',
  } = options

  const commonConfig = await getCommonConfig({ outputDir })

  return merge<DevConfig>(commonConfig, {
    mode: 'development',
    stats: {
      preset: 'minimal',
    },
    devtool: 'inline-source-map',

    // https://github.com/webpack-contrib/webpack-hot-middleware
    entry: Object.keys(commonConfig.entry as Record<string, string> || {}).reduce((acc, key) => {
      acc[key] = [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        (commonConfig.entry as Record<string, string>)[key],
      ]
      return acc
    }, {} as Record<string, any>),

    // https://www.webpackjs.com/configuration/dev-server/
    devServer: {
      static: {
        directory: path.resolve(outputDir),
      },
      allowedHosts: 'all',
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    //   proxy: [
    //     {
    //       context: '/api',
    //       target: 'http://127.0.0.1:3000',
    //       changeOrigin: true,
    //     },
    //   ],
    },
    // performance: {
    //   hints: false,
    // },
    plugins: [
      // https://www.webpackjs.com/guides/hot-module-replacement
      new Webpack.HotModuleReplacementPlugin(),
    ],
    // https://www.webpackjs.com/guides/development/#using-webpack-dev-server
    optimization: {
      runtimeChunk: 'single',
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    output: {
      filename: 'js/[name]_[chunkhash:8].bundle.js',
      path: path.resolve(outputDir),
      clean: true,
      publicPath: '/',
    },
  })
}
