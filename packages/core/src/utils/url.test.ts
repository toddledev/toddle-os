import { describe, expect, test } from '@jest/globals'
import { validateUrl } from './url'

describe('validateUrl()', () => {
  test('it validates urls correctly', () => {
    expect(validateUrl('https://toddle.dev')).toBeInstanceOf(URL)
    expect(validateUrl('not-a-url')).toBe(false)
  })
})
