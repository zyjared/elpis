import type { Colors } from 'picocolors/types'
import colors from 'picocolors'

export interface Logger {
  info: (...msgs: any[]) => void
  success: (...msgs: any[]) => void
  error: (...msgs: any[]) => void
  warn: (...msgs: any[]) => void
  debug: (...msgs: any[]) => void
  child: (title: string) => Logger
}

interface LoggerOptions {
  title?: string
  debug?: boolean
  color?: Exclude<keyof Colors, 'isColorSupported' | 'reset'>
  sep?: string
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const {
    title = '',
    debug = false,
    sep = '/',
    color = 'cyan',
  } = options

  function h(c?: LoggerOptions['color']) {
    // eslint-disable-next-line no-console
    return (...msgs: any[]) => console.log(colors[c || color](`[${title}]`), ...msgs)
  }

  return {
    info: h(),
    success: h('green'),
    error: h('red'),
    warn: h('yellow'),
    debug: debug ? h('gray') : () => {},
    child: (childTitle: string) => createLogger({
      title: [title, childTitle].join(sep),
      debug,
      sep,
    }),
  }
}

export const logger = createLogger({
  title: 'elpis',
})
