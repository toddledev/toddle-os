import { describe, expect, test } from '@jest/globals'
import handler from './handler'

describe('Formula: lowercase', () => {
  test('Should return the lowercase version of the string', () => {
    expect(handler(['Hello World'], undefined as any)).toBe('hello world')
  })
})
