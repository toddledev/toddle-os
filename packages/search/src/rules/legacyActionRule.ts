import { ActionModel } from '@toddledev/core/dist/component/component.types'
import type { Rule } from '../types'

export const legacyActionRule: Rule<{
  name: string
}> = {
  code: 'legacy action',
  level: 'warning',
  category: 'Deprecation',
  visit: (report, { path, value, nodeType }) => {
    if (nodeType !== 'action-model') {
      return
    }

    if (isLegacyAction(value)) {
      let details: { name: string } | undefined
      if ('name' in value) {
        details = { name: value.name }
      }
      report(path, details)
    }
  },
}

const isLegacyAction = (model: ActionModel) => {
  switch (model.type) {
    case 'Custom':
    case undefined:
      return legacyCustomActions.some(
        (action) => action.name === model.name && action.type === model?.type,
      )
  }
  return false
}

const legacyCustomActions = [{ type: undefined, name: 'If' }]
