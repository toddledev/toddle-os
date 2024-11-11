import { sortObjectEntries } from '../src/utils/collections'

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
