import type Application from 'koa'

interface ElpisRequest extends Application.Request {
  body: Record<string, unknown>
}

export interface ElpisContext extends Application.Context {
  request: ElpisRequest
}
