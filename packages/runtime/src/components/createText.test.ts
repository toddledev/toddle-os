import { describe, expect, test } from '@jest/globals'
import type { ComponentData } from '@toddledev/core/dist/component/component.types'
import { valueFormula } from '@toddledev/core/dist/formula/formulaUtils'
import { Signal } from '../signal/signal'
import { ComponentContext } from '../types'
import { createText } from './createText'

describe('createText()', () => {
  test('it returns a span element with text in it', () => {
    const textElement = createText({
      ctx: {
        isRootComponent: false,
        component: { name: 'My Component' },
      } as Partial<ComponentContext> as any,
      dataSignal: undefined as any,
      path: 'test-text-element',
      id: 'test-text-element-id',
      node: {
        type: 'text',
        value: valueFormula('Hello world'),
      },
    })
    expect(textElement.tagName).toBe('SPAN')
    expect(textElement.getAttribute('data-node-id')).toBe(
      'test-text-element-id',
    )
    expect(textElement.getAttribute('data-id')).toBe('test-text-element')
    expect(textElement.getAttribute('data-component')).toBe('My Component')
    expect(textElement.children.length).toBe(0)
    expect(textElement.innerText).toBe('Hello world')
  })
  test('it does not add a data-component attribute for root elements', () => {
    const textElement = createText({
      ctx: { isRootComponent: true } as Partial<ComponentContext> as any,
      dataSignal: undefined as any,
      path: 'test-text-element',
      id: 'test-text-element-id',
      node: {
        type: 'text',
        value: valueFormula('Hello world'),
      },
    })
    expect(textElement.getAttribute('data-component')).toBeNull()
  })
  test('Signal changes update the text element', () => {
    const dataSignal = new Signal<ComponentData>({
      Attributes: { text: 'Hello world' },
    })
    const textElement = createText({
      ctx: { dataSignal } as Partial<ComponentContext> as any,
      dataSignal,
      path: '',
      id: '',
      node: {
        type: 'text',
        value: {
          type: 'path',
          path: ['Attributes', 'text'],
        },
      },
    })
    expect(textElement.innerText).toBe('Hello world')
    dataSignal.set({ Attributes: { text: 'Goodbye world' } })
    expect(textElement.innerText).toBe('Goodbye world')
  })
  test('Show formulas are not respected for text elements', () => {
    const textElement = createText({
      ctx: {} as Partial<ComponentContext> as any,
      dataSignal: undefined as any,
      path: '',
      id: '',
      node: {
        type: 'text',
        value: valueFormula('Hello world'),
        condition: valueFormula(false),
      },
    })
    expect(textElement.innerText).toBe('Hello world')
  })
  test('Repeat formulas are not respected for text elements', () => {
    const textElement = createText({
      ctx: {} as Partial<ComponentContext> as any,
      dataSignal: undefined as any,
      path: '',
      id: '',
      node: {
        type: 'text',
        value: valueFormula('Hello world'),
        repeat: valueFormula(['1', '2', '3']),
      },
    })
    expect(textElement.innerText).toBe('Hello world')
  })
})
