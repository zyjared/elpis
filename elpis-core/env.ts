import type { ElpisApp } from './types'
import process from 'node:process'

function getEnvAlias(mode: ElpisApp['env']['mode']) {
  switch (mode) {
    case 'production':
      return 'prod'
    case 'beta':
      return 'beta'
    default:
      return 'dev'
  }
}

function initEnv(): ElpisApp['env'] {
  // windows 中，set 设置后可能携带空格
  const mode = (
    process.env.NODE_ENV
    || 'development'
  ).trim() as ElpisApp['env']['mode']

  const alias = getEnvAlias(mode)
  return {
    dev: mode === 'development',
    beta: mode === 'beta',
    prod: mode === 'production',
    mode,
    alias,
  }
}

export const env = initEnv()
