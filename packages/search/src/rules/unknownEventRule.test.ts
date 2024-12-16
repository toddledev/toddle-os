import { valueFormula } from '@toddledev/core/dist/formula/formulaUtils'
import { searchProject } from '../searchProject'
import { unknownEventRule } from './unknownEventRule'

describe('unknownEvent', () => {
  test('should report unknown events', () => {
    const problems = Array.from(
      searchProject({
        files: {
          components: {
            test: {
              name: 'test',
              nodes: {
                root: {
                  type: 'element',
                  attrs: {},
                  classes: {},
                  events: {
                    click: {
                      trigger: 'click',
                      actions: [
                        {
                          type: 'TriggerEvent',
                          event: 'unknown-event',
                          data: valueFormula(null),
                        },
                      ],
                    },
                  },
                  tag: 'div',
                  children: [],
                  style: {},
                },
              },
              formulas: {},
              apis: {},
              attributes: {},
              variables: {},
              events: [
                {
                  name: 'known-event',
                  // eslint-disable-next-line inclusive-language/use-inclusive-words
                  dummyEvent: {
                    name: 'Name',
                  },
                },
              ],
            },
          },
        },
        rules: [unknownEventRule],
      }),
    )

    expect(problems).toHaveLength(1)
    expect(problems[0].code).toBe('unknown event')
    expect(problems[0].details).toEqual({ name: 'unknown-event' })
  })

  test('should not report events that exist', () => {
    const problems = Array.from(
      searchProject({
        files: {
          components: {
            test: {
              name: 'test',
              nodes: {
                root: {
                  type: 'element',
                  attrs: {},
                  classes: {},
                  events: {
                    click: {
                      trigger: 'click',
                      actions: [
                        {
                          type: 'TriggerEvent',
                          event: 'known-event',
                          data: valueFormula(null),
                        },
                      ],
                    },
                  },
                  tag: 'div',
                  children: [],
                  style: {},
                },
              },
              formulas: {},
              apis: {},
              attributes: {},
              variables: {},
              events: [
                {
                  name: 'known-event',
                  // eslint-disable-next-line inclusive-language/use-inclusive-words
                  dummyEvent: {
                    name: 'Name',
                  },
                },
              ],
            },
          },
        },
        rules: [unknownEventRule],
      }),
    )

    expect(problems).toEqual([])
  })
})
