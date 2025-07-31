import type { ElpisApp } from './types'
import process from 'node:process'

function initEnv(): ElpisApp['env'] {
  return {
    dev: process.env.NODE_ENV === 'development',
    prod: process.env.NODE_ENV === 'production',
    mode: process.env.NODE_ENV || 'development',
  }
}

export const env = initEnv()
