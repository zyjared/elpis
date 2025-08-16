import { Elpis } from './elpis-core'

const elpis = new Elpis()

elpis.start({
  homePage: '/',
  businessDir: './app',
  pagesDir: './app/public',
})
