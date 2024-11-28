import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<number> = ([collection, item]) => {
  if (typeof collection === 'string') {
    return collection.lastIndexOf(item as any)
  }

  if (Array.isArray(collection)) {
    return collection.findLastIndex((i) =>
      (globalThis as any).toddle.isEqual(i, item),
    )
  }
  // throw new Error("Argument 'Array' must be of type array or string")
  return null
}

export default handler