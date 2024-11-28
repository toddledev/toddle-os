import type { FormulaHandler } from '@toddledev/core/dist/types'

const handler: FormulaHandler<Date> = () => {
  return new Date()
}

export default handler
