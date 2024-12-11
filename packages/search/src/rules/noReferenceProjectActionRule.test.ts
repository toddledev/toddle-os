import { searchProject } from '../searchProject'
import { noReferenceProjectActionRule } from './noReferenceProjectActionRule'

describe('noReferenceProjectAction', () => {
  test('should detect unused global actions', () => {
    const problems = Array.from(
      searchProject({
        files: {
          actions: {
            'my-action': {
              name: 'my-action',
              arguments: [],
              handler: '() => console.log("test")',
              variableArguments: false,
            },
          },
          components: {
            test: {
              name: 'test',
              nodes: {},
              formulas: {},
              apis: {},
              attributes: {},
              variables: {},
            },
          },
        },
        rules: [noReferenceProjectActionRule],
      }),
    )

    expect(problems).toHaveLength(1)
    expect(problems[0].code).toBe('no-reference project action')
    expect(problems[0].path).toEqual(['actions', 'my-action'])
  })

  test('should not detect used global actions', () => {
    const problems = Array.from(
      searchProject({
        files: {
          actions: {
            'my-action': {
              name: 'my-action',
              arguments: [],
              handler: '() => console.log("test")',
              variableArguments: false,
            },
          },
          components: {
            test: {
              name: 'test',
              nodes: {},
              formulas: {},
              apis: {},
              attributes: {},
              variables: {},
              onLoad: {
                trigger: 'onLoad',
                actions: [
                  {
                    type: 'Custom',
                    name: 'my-action',
                    arguments: [],
                  },
                ],
              },
            },
          },
        },
        rules: [noReferenceProjectActionRule],
      }),
    )

    expect(problems).toEqual([])
  })
})
