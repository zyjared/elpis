import { pathToFileURL } from 'node:url'
import fs from 'fs-extra'
import glob from 'tiny-glob'

/**
 * 导入模块
 */
export async function importModule(str: string, cwd: string) {
  if (!fs.existsSync(cwd)) {
    return null
  }

  const files = await glob(`${str}.{js,mjs,ts}`, {
    cwd,
    filesOnly: true,
    absolute: true,
  }) as string[]

  if (files.length === 0) {
    return null
  }

  try {
    const file = pathToFileURL(files[0]).href
    return await import(file)
  }
  catch (error) {
    return null
  }
}
