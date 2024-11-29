import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<boolean> = ([first, second]: any[]) => {
  return first > second
}

export default handler
