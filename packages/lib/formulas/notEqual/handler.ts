import type { FormulaHandler } from '@toddledev/core/dist/types'
const handler: FormulaHandler<boolean> = ([a, b]) => {
  return !(globalThis as any).toddle.isEqual(a, b)
}

export default handler
