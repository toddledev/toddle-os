import * as libActions from '@toddledev/std-lib/dist/actions'
import * as libFormulas from '@toddledev/std-lib/dist/formulas'
import fastDeepEqual from 'fast-deep-equal'
import { defineComponents } from './custom-element/defineComponents'

const loadCorePlugins = () => {
  window.toddle.isEqual = fastDeepEqual

  // load default formulas and actions
  Object.entries(libFormulas).forEach(([name, module]) =>
    window.toddle.registerFormula(
      '@toddle/' + name,
      module.default as any,
      'getArgumentInputData' in module
        ? module.getArgumentInputData
        : undefined,
    ),
  )
  Object.entries(libActions).forEach(([name, module]) =>
    window.toddle.registerAction('@toddle/' + name, module.default),
  )
}

export { defineComponents, loadCorePlugins }
