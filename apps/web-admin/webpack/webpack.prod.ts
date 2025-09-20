import { merge } from 'webpack-merge'
import { getCommonConfig } from './webpack.common'

export async function getProdConfig() {
  const commonConfig = await getCommonConfig()

  return merge(commonConfig, {
    mode: 'production',

    performance: {
      hints: false,
    },

    plugins: [
      // 优化方向
      // - 多进程处理
      // - 缓存
    ],
  })
}
