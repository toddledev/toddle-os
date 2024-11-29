import type { FormulaHandler } from '@toddledev/core/dist/types'
import { isObject } from '@toddledev/core/dist/utils/util'

const handler: FormulaHandler<number> = ([collection]) => {
  if (Array.isArray(collection)) {
    return collection.length
  }
  if (isObject(collection)) {
    return Object.keys(collection).length
  }
  if (typeof collection === 'string') {
    return collection.length
  }
  // throw new Error("Argument 'Array' must be of type array or string")
  return null
}

export default handler
