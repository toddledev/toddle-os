import type { FormulaHandler } from '@toddledev/core/dist/types'
import { isObject } from '@toddledev/core/dist/utils/util'

const handler: FormulaHandler<string> = (items) => {
  if (items.every(Array.isArray)) {
    const result = []
    for (const item of items) {
      result.push(...item)
    }
    return result
  }
  if (items.every(isObject)) {
    return Object.assign({}, ...items)
  }
  return items.join('')
}

export default handler
