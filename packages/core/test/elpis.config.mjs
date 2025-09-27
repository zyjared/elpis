import path from 'node:path'
import process from 'node:process'
import { defineElpisOptions } from '../src'

export default defineElpisOptions({
  debug: true,
  baseDir: process.cwd(),
  serverDir: path.resolve('./test/server'),
})
