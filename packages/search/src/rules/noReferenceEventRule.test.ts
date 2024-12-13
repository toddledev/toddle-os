import { valueFormula } from '@toddledev/core/dist/formula/formulaUtils'
import { searchProject } from '../searchProject'
import { noReferenceEventRule } from './noReferenceEventRule'

describe('noReferenceEventRule', () => {
  test('should detect events with no references', () => {
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
                  name: 'unused-event',
                  // eslint-disable-next-line inclusive-language/use-inclusive-words
                  dummyEvent: {
                    name: 'Name',
                  },
                },
              ],
            },
          },
        },
        rules: [noReferenceEventRule],
      }),
    )

    expect(problems).toHaveLength(1)
    expect(problems[0].code).toBe('no-reference event')
    expect(problems[0].path).toEqual([
      'components',
      'test',
      'events',
      'unused-event',
    ])
  })

  test('should not detect events with references', () => {
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
        rules: [noReferenceEventRule],
      }),
    )

    expect(problems).toEqual([])
  })
})
