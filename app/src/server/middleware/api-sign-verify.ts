import { defineMiddleware } from '@elpis/core'
import md5 from 'md5'

export default defineMiddleware((app) => {
  return async (ctx, next) => {
    // 只对 /api/ 开头的请求进行签名校验
    if (!ctx.path.startsWith('/api/')) {
      return await next()
    }

    const { path, method } = ctx
    const { header } = ctx.request

    // 也就是前端需要获得 key 并计算签名
    const { s_sign: sSign, s_t: st } = header

    const signKey = 'test_sign_key' // 应当复杂
    const signature = md5(`${signKey}_${st}`)
    app.logger.info(`[${method} ${path}] signature: ${signature}`)

    if (
      !sSign
      || !st
      || signature !== (sSign as string).toLowerCase()
      || Date.now() - Number(st) > 600 * 1000
    ) {
      ctx.status = 200
      ctx.body = {
        success: false,
        message: 'signature not correct or api timeout!!',
        code: 445,
      }
      return
    }

    await next()
  }
})
