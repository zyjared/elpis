import process from 'node:process'
import { Command } from 'commander'
import webpack from 'webpack'
import { getDevConfig } from './config/webpack.dev'
import { getProdConfig } from './config/webpack.prod'

const program = new Command()

program
  .option('-m, --mode <mode>', 'build mode', 'dev')
  .parse(process.argv)
  .action((options) => {
    const mode = options.mode
    build(mode)
  })

program.parse()

async function build(mode: 'dev' | 'prod') {
  const config = mode === 'dev' ? await getDevConfig() : await getProdConfig()

  webpack(config, (err, stats) => {
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
}
