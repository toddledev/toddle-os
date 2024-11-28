import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<string> = (_, ctx) => {
  return ctx.env.branchName
}

export default handler
