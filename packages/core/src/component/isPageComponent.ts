import { isDefined } from '../utils/util'
import type { Component } from './component.types'

export const isPageComponent = (component: Component) =>
  isDefined(component.route)
