import type {
  ApiStatus,
  LegacyApiStatus,
} from '@toddledev/core/dist/api/apiTypes'
import type { ToddleComponent } from '@toddledev/core/dist/component/ToddleComponent'
import type { FormulaContext } from '@toddledev/core/dist/formula/formula'

export type ApiCache = Record<string, ApiStatus>

export type ApiEvaluator = (args: {
  component: ToddleComponent<string>
  formulaContext: FormulaContext
  req: Request
  apiCache: ApiCache
  updateApiCache: (key: string, value: ApiStatus) => void
}) => Promise<
  Record<
    string,
    LegacyApiStatus | (ApiStatus & { inputs?: Record<string, unknown> })
  >
>
