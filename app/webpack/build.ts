import process from 'node:process'
import webpack from 'webpack'
import baseConfig from './config/webpack.base'

webpack(baseConfig, (err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  if (!stats)
    return

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: true,
  }))
})
