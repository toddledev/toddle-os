import type { FormulaHandler } from '@toddledev/core/dist/types'
import { toBoolean } from '@toddledev/core/dist/utils/util'

const handler: FormulaHandler<boolean> = ([a]) => !toBoolean(a)

export default handler
