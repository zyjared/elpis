import type { ElpisApp } from '../types'
import { resolve } from 'node:path'
import fs from 'fs-extra'

/**
 * config loader
 *
 * 配置加载器
 *
 * 配置区分：开发、测试、生产,
 * 通过 env 环境读取不同文件配置 env.config
 *
 * 目录下对应的 config 配置
 *
 * @example
 * ```txt
 * app/config/
 * ├── config.default.ts  --> 默认配置
 * ├── config.dev.ts      --> 开发配置
 * ├── config.beta.ts     --> 测试配置
 * └── config.prod.ts     --> 生产配置
 * ```
 */
export async function configLoader(app: ElpisApp) {
  // 找到 config 目录
  const configPath = resolve(app.baseDir, 'config')

  // 获取 default.config
  const ext = app.env.prod ? 'js' : 'ts'
  const defaultConfigPath = resolve(configPath, `config.default.${ext}`)

  let defaultConfig = {}
  if (!fs.existsSync(defaultConfigPath)) {
    console.error(`config.default.${ext} not found`)
  }
  else {
    try {
      defaultConfig = await importConfig(defaultConfigPath)
    }
    catch (error) {
      console.error(`Failed to load config.default.${ext}:`, error)
    }
  }

  // 获取 env.config
  const envConfigName = `config.${app.env.alias}.${ext}`
  const envConfigPath = resolve(configPath, envConfigName)

  // 如果没有其他配置，提前结束
  if (!fs.existsSync(envConfigPath)) {
    app.config = defaultConfig
    console.error(`${envConfigName} not found`)
    return
  }

  let envConfig = {}
  try {
    envConfig = await importConfig(envConfigPath)
  }
  catch (error) {
    console.error(`Failed to load ${envConfigName}:`, error)
  }

  // 覆盖加载 config 配置
  app.config = { ...defaultConfig, ...envConfig }
}

async function importConfig(path: string) {
  const url = new URL(`file://${path}`).href
  const module = await import(url)
  return module.default
}
