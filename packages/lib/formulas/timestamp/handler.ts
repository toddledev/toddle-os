import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<number> = ([date]) => {
  if (!date || !(date instanceof Date)) {
    // throw new Error('Invalid input for Date')
    return null
  }
  return date.getTime()
}

export default handler
