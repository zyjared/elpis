import { Command } from 'commander'
import { createServer } from './server'

new Command()
  .action(() => {
    createServer()
  })
  .parse()
