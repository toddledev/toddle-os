import { isDefined } from '@toddledev/core/dist/utils/util'
import { Rule } from '../types'

/**
 * Lighthouse reports a similar issue:
 * https://web.dev/articles/optimize-cls?utm_source=lighthouse&utm_medium=devtools#images_without_dimensions
 */
export const imageWithoutDimensionRule: Rule = {
  code: 'image without dimension',
  level: 'warning',
  category: 'Performance',
  visit: (report, { path, nodeType, value }) => {
    if (
      nodeType === 'component-node' &&
      value.type === 'element' &&
      ['img', 'source'].includes(value.tag) &&
      (!isDefined(value.attrs.width) || !isDefined(value.attrs.height))
    ) {
      report(path)
    }
  },
}
