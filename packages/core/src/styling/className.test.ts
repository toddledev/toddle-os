import { toValidClassName } from './className'

describe('toValidClassName()', () => {
  test('it trims leading and trailing whitespace and replace the remaining whitespace with hyphens', () => {
    expect(toValidClassName('  my class  ')).toBe('my-class')
  })

  test('it escapes invalid characters by prefixing them with a backslash, if flag is set', () => {
    expect(toValidClassName('my.class', true)).toBe('my\\.class')
  })

  test('it does not escape invalid characters by default', () => {
    expect(toValidClassName('my.class')).toBe('my.class')
  })

  test('it ensures the class name does not start with a number or special character', () => {
    expect(toValidClassName('1class')).toBe('_1class')
  })
})
