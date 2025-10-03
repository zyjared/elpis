import { Command } from 'commander'
import { createServer } from './server'

new Command()
  .option('--server <server>', 'elpis server 的文件夹')
  .action((options: { server?: string } = {}) => {
    const { server = './server' } = options
    createServer({
      elpisServer: {
        serverDir: server,
      },
    })
  })
  .parse()
