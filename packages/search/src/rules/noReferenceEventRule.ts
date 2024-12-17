import type { Rule } from '../types'

export const noReferenceEventRule: Rule<{ name: string }> = {
  code: 'no-reference event',
  level: 'warning',
  category: 'No References',
  visit: (report, args) => {
    if (args.nodeType !== 'component-event') {
      return
    }
    const { path, memo, value } = args
    const { component, event } = value
    const events = memo(`${component.name}-events`, () => {
      const events = new Set<string>()
      for (const [, action] of component.actionModelsInComponent()) {
        if (action.type === 'TriggerEvent') {
          events.add(action.event)
        }
      }

      return events
    })
    if (events.has(event.name)) {
      return
    }

    report(path, { name: event.name })
  },
}
