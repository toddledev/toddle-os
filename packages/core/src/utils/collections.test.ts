import { omitPaths, sortObjectEntries } from './collections'

describe('sortObjectEntries()', () => {
  test('it sorts entries in an object based on the callback function', () => {
    expect(
      sortObjectEntries(
        { c: 'hello', a: 'value', b: 'otherValue' },
        ([key]) => key,
      ),
    ).toEqual([
      ['a', 'value'],
      ['b', 'otherValue'],
      ['c', 'hello'],
    ])
    expect(
      sortObjectEntries(
        { c: 'hello', a: 'value', b: 'otherValue' },
        ([_, value]) => value,
      ),
    ).toEqual([
      ['c', 'hello'],
      ['b', 'otherValue'],
      ['a', 'value'],
    ])
  })
})

describe('omitPaths()', () => {
  test('it filters out paths from an object', () => {
    expect(
      omitPaths(
        {
          a: 'value',
          b: {
            c: 'hello',
            d: 'world',
          },
          e: {
            f: {
              g: 'foo',
            },
            h: 'bar',
          },
        },
        [['a'], ['b', 'c'], ['e', 'f', 'g']],
      ),
    ).toEqual({
      b: {
        d: 'world',
      },
      e: {
        f: {},
        h: 'bar',
      },
    })
  })
})
