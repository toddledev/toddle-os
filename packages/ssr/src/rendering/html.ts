import { PageRoute } from '@toddledev/core/src/component/component.types'
import {
  applyFormula,
  FormulaContext,
} from '@toddledev/core/src/formula/formula'

export const getHtmlLanguage = ({
  pageInfo,
  formulaContext,
  defaultLanguage = 'en',
}: {
  pageInfo?: PageRoute['info']
  formulaContext: FormulaContext
  defaultLanguage?: string
}) =>
  pageInfo?.language
    ? applyFormula(pageInfo.language.formula, formulaContext)
    : defaultLanguage
