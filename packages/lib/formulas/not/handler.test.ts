import { describe, expect, test } from '@jest/globals'
import handler from './handler'

describe('Formula: Not', () => {
  test('should return logical opposite', () => {
    expect(handler([true], undefined as any)).toBe(false)
    expect(handler([false], undefined as any)).toBe(true)
    expect(handler([0], undefined as any)).toBe(false)
    expect(handler([null], undefined as any)).toBe(true)
  })
})
