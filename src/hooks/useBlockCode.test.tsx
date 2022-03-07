import { fireEvent, render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, test, vi } from 'vitest'
import { EMPTY_VALUE, KEYLIST } from '../data'
import { useBlockCode } from './usBlockCode'
import { Utils } from '../utils'

const DEFAULT_VALUES = ['1', '2', '3', '4', '5', '6']

const REVERSE_DEFAULT_VALUES = [...DEFAULT_VALUES].reverse()

describe('useBlockCode', () => {
  test('Should return input props correctly', () => {
    const spyCreateId = vi.spyOn(Utils, 'createId')
    const { result } = renderHook(() => useBlockCode())
    const { ids, ...restProps } = result.current

    expect(spyCreateId).toBeDefined()
    expect(spyCreateId).toHaveBeenCalledTimes(6)
    expect(ids.length).toBe(6)
    expect(restProps).toMatchSnapshot()
  })

  test('Should call setValues correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.values).toMatchSnapshot()

    result.current.setValues(DEFAULT_VALUES)
    expect(result.current.values).toMatchSnapshot()

    result.current.setValues(REVERSE_DEFAULT_VALUES)
    expect(result.current.values).toMatchSnapshot()

    result.current.setValues([])
    expect(result.current.values).toMatchSnapshot()
  })

  test('Should call setActiveIndex correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.activeIndex).toBe(0)
    result.current.setActiveIndex(1)
    expect(result.current.activeIndex).toBe(1)
  })

  test('Should call setActiveIndex correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.activeIndex).toBe(0)
    result.current.setActiveIndex(1)
    expect(result.current.activeIndex).toBe(1)
  })

  test('Should call onSetValueAtIndex correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.values[0]).toBe(EMPTY_VALUE)
    result.current.onSetValueAtIndex('1', 0)
    expect(result.current.values[0]).toBe('1')
  })

  test('Should call nSetActiveIndex correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.activeIndex).toMatchSnapshot()
    result.current.onSetActiveIndex(1)
    expect(result.current.activeIndex).toMatchSnapshot()
  })

  test('Should call onResetValues correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.values).toMatchSnapshot()

    result.current.setValues(DEFAULT_VALUES)
    expect(result.current.values).toMatchSnapshot()

    result.current.onResetValues()

    expect(result.current.values).toMatchSnapshot()
  })

  test('Should call onReset correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    expect(result.current.values).toMatchSnapshot()
    expect(result.current.activeIndex).toMatchSnapshot()

    result.current.onSetValueAtIndex('1', 2)
    result.current.onSetActiveIndex(2)
    expect(result.current.values[2]).toMatchSnapshot()
    expect(result.current.activeIndex).toMatchSnapshot()

    result.current.onReset()

    expect(result.current.values).toMatchSnapshot()
    expect(result.current.activeIndex).toMatchSnapshot(0)
  })

  test('Should call onEnoughData correctly', () => {
    const mockOnComplete = vi.fn()
    const { result } = renderHook(() =>
      useBlockCode({
        onComplete: mockOnComplete
      })
    )

    result.current.setValues(DEFAULT_VALUES)
    result.current.onEnoughData()
    expect(mockOnComplete).toHaveBeenCalled()
  })

  test('Should not call onEnoughData if the data is not enough', () => {
    const mockOnComplete = vi.fn()
    const { result } = renderHook(() =>
      useBlockCode({
        onComplete: mockOnComplete
      })
    )

    result.current.onEnoughData()
    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  test('Should call onCreateInputProps correctly', () => {
    const { result } = renderHook(() => useBlockCode())
    expect(result.current.onCreateInputProps(0)).toMatchSnapshot()
  })

  test('Should call onValuesChange correctly', async () => {
    const spyOnValuesChange = vi.fn()
    const { result, waitFor } = renderHook(() =>
      useBlockCode({ onValuesChange: spyOnValuesChange })
    )

    const { getByLabelText } = render(
      <input
        aria-label="block-code-values-change"
        onInput={result.current.onInput}
      />
    )
    const input = getByLabelText('block-code-values-change')
    fireEvent.input(input, { currentTarget: { value: 1 } })

    await waitFor(() => {
      expect(result.current.values).toMatchSnapshot()
      expect(spyOnValuesChange).toHaveBeenCalled()
    })
  })

  test('Should call onValuesChange correctly', async () => {
    const spyOnInputChange = vi.fn()
    const { result, waitFor } = renderHook(() =>
      useBlockCode({ onInputChange: spyOnInputChange })
    )

    const { getByLabelText } = render(
      <input
        aria-label="block-code-input-change"
        {...result.current.onCreateInputProps(0)}
      />
    )
    const input = getByLabelText('block-code-input-change')
    fireEvent.input(input, { currentTarget: { value: 1 } })

    await waitFor(() => {
      expect(result.current.values).toMatchSnapshot()
      expect(spyOnInputChange).toHaveBeenCalled()
    })
  })

  test('Should call onValidateBeforeChange correctly', async () => {
    const spyOnValidateBeforeChange = vi.fn()
    const { result, waitFor } = renderHook(() =>
      useBlockCode({ onValidateBeforeChange: spyOnValidateBeforeChange })
    )

    const { getByLabelText } = render(
      <input
        aria-label="block-code-validate-before-on-change"
        {...result.current.onCreateInputProps(0)}
      />
    )
    const input = getByLabelText('block-code-validate-before-on-change')
    fireEvent.input(input, { currentTarget: { value: 1 } })

    await waitFor(() => {
      expect(result.current.values).toMatchSnapshot()
      expect(spyOnValidateBeforeChange).toHaveBeenCalled()
    })
  })

  test('Should call onCreateRef correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    const { getByLabelText } = render(
      <input
        aria-label="block-code-create-ref"
        {...result.current.onCreateInputProps(0)}
      />
    )
    const input = getByLabelText('block-code-create-ref') as HTMLInputElement

    expect(result.current.refs.current[0]).toBe(input)
  })

  test('Should call onPaste correctly', () => {
    const { result } = renderHook(() =>
      useBlockCode({
        onValidateBeforeChange: async ({ value }) => {
          expect(DEFAULT_VALUES.includes(value)).toBeTruthy()
          return true
        }
      })
    )

    const { getByLabelText } = render(
      <input
        aria-label="block-code-on-paste"
        {...result.current.onCreateInputProps(0)}
      />
    )

    const input = getByLabelText('block-code-on-paste')
    fireEvent.paste(input)

    /**
     * TODO:
     * - Test the state propertly when vitest supports state changes
     */
  })

  test('Should call onKeyDown correctly', () => {
    const { result } = renderHook(() => useBlockCode())

    const { getByLabelText } = render(
      <input
        aria-label="block-code-on-key-down"
        {...result.current.onCreateInputProps(0)}
      />
    )

    const input = getByLabelText('block-code-on-key-down')

    fireEvent.keyDown(input, { key: KEYLIST.ARROW_LEFT })
    fireEvent.keyDown(input, { key: KEYLIST.ARROW_RIGHT })
    fireEvent.keyDown(input, { key: KEYLIST.BACK_SPACE })
    fireEvent.keyDown(input, { key: KEYLIST.DELETE })

    /**
     * TODO:
     * - Test the state propertly when vitest supports state changes
     */
  })
})
