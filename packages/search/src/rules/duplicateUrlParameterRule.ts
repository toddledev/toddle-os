import { isDefined } from '@toddledev/core/dist/utils/util'
import type { Rule } from '../types'

export const duplicateUrlParameterRule: Rule<{ trigger: string }> = {
  code: 'duplicate url parameter',
  level: 'warning',
  category: 'Quality',
  visit: (report, { nodeType, path, value }) => {
    if (
      nodeType !== 'component' ||
      !isDefined(value.route) ||
      !isDefined(value.route.path) ||
      !isDefined(value.route.query) ||
      value.route.path.length === 0 ||
      Object.values(value.route.query).length === 0
    ) {
      return
    }
    const pathNames = new Set(
      value.route.path
        .filter((path) => path.type === 'param' || path.optional)
        .map((path) => path.name),
    )
    Object.keys(value.route.query).forEach((key) => {
      if (pathNames.has(key)) {
        report([...path, 'route', 'query', key])
      }
    })
  },
}
