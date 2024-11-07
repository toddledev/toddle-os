const LOCALHOSTS = ['http://localhost:54404', 'http://preview.localhost:54404']

export const isLocalhostUrl = (hrefOrOrigin: string) =>
  LOCALHOSTS.some((host) => hrefOrOrigin.startsWith(host))

export const isLocalhostHostname = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1'

export const validateUrl = (url?: string | null, base?: string) => {
  if (typeof url !== 'string') {
    return false
  }
  try {
    return new URL(url, base)
  } catch {
    return false
  }
}

export const PROXY_URL_HEADER = 'x-toddle-url'
