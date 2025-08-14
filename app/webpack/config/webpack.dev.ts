import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import path from 'node:path'
import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Webpack from 'webpack'
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
    // stats: {
    //   preset: 'minimal',
    // },
    devtool: 'inline-source-map',

    // https://www.webpackjs.com/configuration/dev-server/
    devServer: {
      static: {
        // FIXME: 不能修改该了是 common.config 的配置造成的
        // HtmlWebpackPlugin 配置项不是可配置的，导致了该问题
        // 暂不处理
        directory: path.resolve('./app/public'),
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
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
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
    },
    output: {
      filename: 'js/[name]_[chunkhash:8].bundle.js',
      path: path.resolve('./app/public/'),
      clean: true,
      publicPath: '/',
    },
  })
}
