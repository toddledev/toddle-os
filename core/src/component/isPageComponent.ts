import type { Component } from '../src/component/component.types'
import { isDefined } from '../src/utils/util'

export const isPageComponent = (component: Component) =>
  isDefined(component.route)
