import type { FormulaHandler } from '@toddledev/core/dist/types'
import { toBoolean } from '@toddledev/core/dist/utils/util'

const handler: FormulaHandler<unknown> = (values) => {
  for (const value of values) {
    if (toBoolean(value)) {
      return value
    }
  }
  return null
}

export default handler
