import path from 'node:path'
import { merge } from 'webpack-merge'
import { getCommonConfig } from './webpack.common'

export async function getProdConfig() {
  const commonConfig = await getCommonConfig()

  return merge(commonConfig, {
    mode: 'production',

    output: {
      filename: 'static/js/[name]_[chunkhash:8].bundle.js',
      path: path.resolve('dist'),
      publicPath: '/',
      crossOriginLoading: 'anonymous',
      clean: true,
    },

    performance: {
      hints: false,
    },

    plugins: [
      // 不跟进具体插件和配置，只关注优化方向
      // 否则需要深入了解 webpack 的 api 和设计
      // 学习完之后可能会选择其他打包工具，注意投入回报比
      // 优化方向
      // - 多进程处理
      // - 缓存
    ],
  })
}
