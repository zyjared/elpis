import { Elpis } from './elpis-core'

const elpis = new Elpis()

elpis.start({
  baseDir: './',
  serverDir: './server',
  publicDir: './public',
})
