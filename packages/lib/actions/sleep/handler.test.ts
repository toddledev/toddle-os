import { describe, expect, jest, test } from '@jest/globals'
import { fn } from 'jest-mock'
import handler from './handler'

describe('Action: Sleep', () => {
  test('throws for invalid inputs', () => {
    expect(() => handler([null], undefined as any)).toThrow()
    expect(() => handler([undefined], undefined as any)).toThrow()
  })
  test('triggers a tick event after a duration', () => {
    jest.useFakeTimers()
    const abort = fn()
    const trigger = fn()
    handler([5], {
      triggerActionEvent: trigger,
      abortSignal: {
        addEventListener: abort,
      },
    } as any)
    jest.advanceTimersByTime(6)
    expect(trigger).toBeCalledTimes(1)
    jest.advanceTimersByTime(10)
    expect(trigger).toBeCalledTimes(1)
  })
  test("doesn't trigger a tick if aborted", () => {
    jest.useFakeTimers()
    const abortFunctions: Array<() => unknown> = []
    const triggerActionEvent = fn()
    handler([5], {
      triggerActionEvent,
      abortSignal: {
        addEventListener: (_: never, fn: () => unknown) =>
          abortFunctions.push(fn),
      },
    } as any)
    jest.advanceTimersByTime(2)
    abortFunctions.forEach((fn) => fn())
    expect(triggerActionEvent).toBeCalledTimes(0)
    jest.advanceTimersByTime(5)
    expect(triggerActionEvent).toBeCalledTimes(0)
  })
})
