import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<readonly string[]> = (_, { env }) => {
  if (!env.isServer) {
    return window.navigator.languages
  } else {
    return (
      env.request?.headers['accept-language']
        ?.split(',')
        .map((lang) => lang.split(';')[0]) ?? []
    )
  }
}

export default handler
