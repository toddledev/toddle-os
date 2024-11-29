import type { FormulaHandler } from '@toddledev/core/dist/types'
import { parseJSONWithDate } from '@toddledev/core/dist/utils/json'

const handler: FormulaHandler<unknown> = ([data]) => {
  if (typeof data !== 'string') {
    // throw new Error("Argument 'JSON string' must be of type string")
    return null
  }
  try {
    return parseJSONWithDate(data)
  } catch {
    return null
  }
}
export default handler
