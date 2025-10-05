import type { Router as ElpisRouter } from '@elpis/core'
import type { ViteDevServer } from 'vite'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'

function replaceTemplateVar(template: string, name: string, value?: string) {
  return value !== undefined
    ? template.replace(new RegExp(`<!--\s*${name}\s*-->`, 'g'), value)
    : template
}

function replaceTemplateVars(template: string, vars: Record<string, string | undefined>) {
  return Object.entries(vars)
    .reduce(
      (acc, [name, value]) => replaceTemplateVar(acc, name, value),
      template,
    )
}

function getDefaultTemplate(opts: {
  title?: string
  client?: string
  outlet?: string
  links?: string[] | string
} = {}) {
  const template = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><!--ssr-title--></title>
    <!--ssr-links-->
  </head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <!--ssr-client-->
  </body>
</html>`

  return replaceTemplateVars(template, {
    'ssr-title': opts.title || 'Elpis',
    'ssr-outlet': opts.outlet,
    'ssr-links': opts.links && (typeof opts.links === 'string' ? opts.links : opts.links.join('')),
    'ssr-client': opts.client && `<script type="module" src="${opts.client}"></script>`,
  })
}

function toPath(str: string) {
  return str.replace(/[\\/]+/g, '/')
}

function ensureStartWith(str: string, prefix: string) {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}

function getEntryFiles(app: string, entryDir: string, cwd: string = process.cwd()) {
  const index = path.join(entryDir, app, 'index.html')
  const client = path.join(entryDir, app, 'main.ts')
  const server = path.join(entryDir, app, 'server.ts')

  const files = {
    index: fs.existsSync(index) ? index : undefined,
    client: fs.existsSync(client)
      ? ensureStartWith(toPath(path.relative(cwd, client)), '/')
      : undefined,
    server: fs.existsSync(server)
      ? ensureStartWith(toPath(path.relative(cwd, server)), '/')
      : undefined,
  }

  return files
}

interface ViteRouterMiddlewareOptions {
  inputDir?: string
}

export function createViteRouterMiddleware(vite: ViteDevServer, opts: ViteRouterMiddlewareOptions = {}) {
  const { inputDir = 'src/entries' } = opts

  const entryDir = path.resolve(inputDir)

  fs.ensureDirSync(path.resolve(inputDir))

  const middleware: ElpisRouter.Middleware = async (ctx, next) => {
    const apps = fs.readdirSync(entryDir)

    const { req } = ctx

    const url = req.url

    if (!url) {
      ctx.status = 404
      ctx.body = '缺少 URL'
      return
    }

    try {
      // /view/web-admin --> web-admin
      const view = url.match(/^\/view\/(.*)$/)?.[1] ?? 'index'

      // view 不存在
      if (!apps.includes(view)) {
        ctx.status = 200
        ctx.set({ 'Content-Type': 'text/html' })
        ctx.body = getDefaultTemplate({
          title: 'Elpis',
          client: '',
          outlet: `入口: ${view} 不存在`,
          links: [],
        })
        return
      }

      // ssr 需要的相关文件
      const entry = getEntryFiles(view, entryDir)

      // 不检查 main 文件
      let template = await vite.transformIndexHtml(
        url,
        entry.index
          ? fs.readFileSync(entry.index, 'utf-8')
          : getDefaultTemplate({
              title: view,
              client: entry.client,
            }),
      )

      // 不检查 server 文件
      if (entry.server) {
        const server = await vite.ssrLoadModule(entry.server)
        const { html } = await server.render(url)
        template = replaceTemplateVar(template, 'ssr-outlet', html)
      }

      ctx.status = 200
      ctx.set({ 'Content-Type': 'text/html' })
      ctx.body = template
    }
    catch (e: any) {
      vite.ssrFixStacktrace(e)
      console.error('SSR 错误:', e)
      ctx.status = 500
      ctx.body = '服务器错误'
      await next()
    }
  }

  return middleware
}
