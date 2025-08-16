export function withBase(url: string, base: string = '/') {
  if (url.startsWith('http')) {
    return url
  }

  return `${base}/${url}`.replace(/\/+/g, '/')
}
