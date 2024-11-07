import type { Component } from '@toddle/core/src/component/component.types'
import { isDefined } from '@toddle/core/src/utils/util'

export const isPageComponent = (component: Component) =>
  isDefined(component.route)
