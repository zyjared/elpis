import type { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import md5 from 'md5'
import { withBase } from '../common/url'
/**
 * 请求头扩展加入 s_t 和 s_sign 字段
 */
type CurlRequestHeader = AxiosRequestHeaders & {
  s_t?: number
  s_sign?: string
}

/**
 * 配置自定义请求头，并扩展 errorMessage 字段
 */
interface CurlRequestConfig<D = any> extends AxiosRequestConfig<D> {
  errorMessage?: string
  headers: CurlRequestHeader
  onError?: (msg: string | undefined) => void
}

/**
 * 响应数据
 */
interface CurlResponseData<T = any> {
  success: boolean
  data?: T
  metadata?: any
  message?: string
  code?: number
  /**
   * 是否签名
   */
}

/**
 * 响应数据纠正扩展后的 config 字段
 */
type CurlResponse<T = any, D = any> = AxiosResponse<CurlResponseData<T>, D> & {

  config: CurlRequestConfig<D>
}

const SIGN_KEY = 'test_sign_key'

const instance = axios.create({
  baseURL: '',
})

instance.interceptors.request.use((config: CurlRequestConfig) => {
  const { url, headers, ...rest } = config
  return {

    responseType: 'json',
    errorMessage: '请求失败',
    timeout: 60000,

    ...rest,

    url: withBase(url || ''),
    headers: {
      ...headers,
      s_t: Date.now(),
      s_sign: md5(`${SIGN_KEY}_${Date.now()}`),
    },
  } as CurlRequestConfig
})

instance.interceptors.response.use((res: CurlResponse) => {
  const { data: resData, config } = res

  const {
    onError = ElMessage.error,
    errorMessage,
  } = config

  const { success } = resData
  if (!success) {
    const { message, code } = resData
    if (code === 442) {
      onError('请求参数错误')
    }
    else if (code === 445) {
      onError('请求不合法')
    }
    else if (code === 50000) {
      onError(message)
    }
    else {
      onError(errorMessage)
    }

    console.error(message)
    res.data = { success, message, code }
    return res
  }

  const { data, metadata } = resData
  res.data = { success, data, metadata }
  return res
}, (error: AxiosError) => {
  // 处理网络错误、超时等异常情况
  let errorMessage = '网络异常，请稍后重试'

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    errorMessage = '请求超时，请稍后重试'
  }
  else if (error.response) {
    // 服务器返回了错误状态码
    const status = error.response.status
    if (status >= 500) {
      errorMessage = '服务器错误，请稍后重试'
    }
    else if (status >= 400) {
      errorMessage = '请求参数错误'
    }
  }
  else if (error.request) {
    // 请求已发出但没有收到响应
    errorMessage = '网络连接失败，请检查网络'
  }

  // 显示错误消息
  if (document) {
    ElMessage.error(errorMessage)
  }
  console.error('Request Error:', error)

  return error
})

export const request = instance

/**
 * 获取数据，axios 响应是 response.data 部分
 */
export async function curl<T = any, R = CurlResponseData<T>>(config: Partial<CurlRequestConfig>) {
  return await instance.request<R>(config).then(res => res.data)
}
