import { describe, expect, test } from 'vitest'
import { isNumeric } from '../plugins'

describe('isNumberic', () => {
  test('Should return true if value is number', () => {
    expect(isNumeric('123456')).toBeTruthy()
  })

  test('Should return false if value is not number', () => {
    expect(isNumeric('123456a')).toBeFalsy()
    expect(isNumeric('a123456')).toBeFalsy()
    expect(isNumeric('123a56')).toBeFalsy()
  })
})
