import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  // eslint-disable-next-line no-console
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
  ctx.body = 'Hello World'
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  await next()
  ctx.body = 'Hello World'
})

app.listen(3000)

// eslint-disable-next-line no-console
console.log('Server is running: http://localhost:3000')
