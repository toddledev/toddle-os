import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<Array<unknown>> = ([list, value]) => {
  if (!Array.isArray(list)) {
    // throw new Error('The Array argument must be of type array')
    return null
  }
  return [value, ...list]
}

export default handler
