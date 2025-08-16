import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { curl } from '../app/pages/common/curl'
import { Elpis } from '../elpis-core'

describe('测试 project 相关接口', () => {
  let app: Elpis
  let baseUrl: string

  beforeAll(async () => {
    app = await new Elpis().start({
      homePage: '/',
      businessDir: './app',
      pagesDir: './app/public',
    })
    baseUrl = app.serverInfo.url
  })

  afterAll(async () => {
    await app.close()
  })

  it('get /api/project/model_list', async () => {
    // axios 可以在 node 环境中使用
    const res = await curl({
      url: `${baseUrl}/api/project/model_list`,
      method: 'get',
    })

    expect(res.success).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })
})
