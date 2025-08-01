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
  const mode = (process.env.NODE_ENV || 'development') as ElpisApp['env']['mode']
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
