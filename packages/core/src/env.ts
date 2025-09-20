import process from 'node:process'

export interface Env {
  dev: boolean
  prod: boolean
  beta: boolean
  mode: 'development' | 'beta' | 'production'
  alias: 'dev' | 'beta' | 'prod'
}

function getEnvAlias(mode: Env['mode']) {
  switch (mode) {
    case 'production':
      return 'prod'
    case 'beta':
      return 'beta'
    default:
      return 'dev'
  }
}

function initEnv(): Env {
  // windows 中，set 设置后可能携带空格
  const mode = (
    process.env.NODE_ENV
    || 'development'
  ).trim() as Env['mode']

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
