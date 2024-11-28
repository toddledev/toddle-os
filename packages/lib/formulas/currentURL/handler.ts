import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<string> = (_, { env }) =>
  env.isServer ? env.request.url : window?.location.href ?? null
export default handler
