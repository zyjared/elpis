import process from 'node:process'
import { pathToFileURL } from 'node:url'
import colors from 'picocolors'
import glob from 'tiny-glob'
import { defineElpisOptions } from './define'

export { defineElpisOptions } from './define'
export type { Options } from './define'

export async function getRootOptions() {
  const files = await glob('elpis.config.{js,mjs,ts}', {
    cwd: process.cwd(),
    filesOnly: true,
    absolute: true,
  }) as string[]

  if (files.length === 0) {
    return defineElpisOptions({})
  }

  try {
    const file = pathToFileURL(files[0]).href
    const module = await import(file)
    return typeof module.default === 'function'
      ? module.default()
      : defineElpisOptions(module.default)
  }
  catch (error) {
    console.warn(colors.yellow('elpis.config.ts'), '读取配置失败，使用默认配置', error)
    return defineElpisOptions({})
  }
}
