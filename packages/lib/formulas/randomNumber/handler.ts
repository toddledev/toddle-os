import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<number> = () => {
  return Math.random()
}

export default handler
