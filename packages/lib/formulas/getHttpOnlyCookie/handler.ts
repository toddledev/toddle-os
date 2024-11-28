import { STRING_TEMPLATE } from '@toddledev/core/dist/api/template'
import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<string> = ([name]) => {
  if (!name || typeof name !== 'string') {
    return null
  }
  return STRING_TEMPLATE('cookies', name)
}

export default handler
