import { describe, expect, test } from 'vitest'
import { Utils } from './utils'

describe('Utils', () => {
  test('findIndex with default', () => {
    const index = Utils.findIndex(1, 1, 1, 6)
    expect(index).toBe(2)
  })

  test('findIndex with max length to be invalid', () => {
    const index = Utils.findIndex(1, 1, 2, 6)
    expect(index).toBe(1)
  })

  test('findIndex with max length to be valid', () => {
    const index = Utils.findIndex(2, 0, 1, 6)
    expect(index).toBe(1)
  })

  test('findIndex with max length is 0 and index is greater than 0', () => {
    const index = Utils.findIndex(1, 2, 2, 6)
    expect(index).toBe(2)
  })

  test('createId', () => {
    const id = Utils.createId()
    expect(id).toContain('block-code-')
  })

  test('createId with custom predix', () => {
    const id = Utils.createId('input')
    expect(id).toContain('input-')
  })

  test('createChunk', () => {
    const chunk = Utils.createChunk('block-code', 1)
    expect(chunk).toMatchSnapshot()
  })

  test('createChunk with length 2', () => {
    const chunk = Utils.createChunk('block-code', 2)
    expect(chunk).toMatchSnapshot()
  })

  test('createChunk with length 2 but value has spaces', () => {
    const chunk = Utils.createChunk('r eact - code', 2)
    expect(chunk).toMatchSnapshot()
  })
})
