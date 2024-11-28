import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<number> = (args) => {
  return Math.max(...args.map(Number))
}

export default handler
