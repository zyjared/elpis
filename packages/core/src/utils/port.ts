import process from 'node:process'
import { execa } from 'execa'

export async function isPortAvailable(port: number): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execa('netstat', ['-an'])
      return !stdout.includes(`:${port}`)
    }
    else {
      const { stdout } = await execa('lsof', ['-i', `:${port}`])
      return !stdout.trim()
    }
  }
  catch {
    return true
  }
}

export async function findAvailablePort(
  startPort: number,
  maxAttempts: number = 100,
): Promise<number | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    if (await isPortAvailable(port)) {
      return port
    }
  }

  return null
}
