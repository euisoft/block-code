import { DEFAULT_INPUT_PROPS, EMPTY_VALUE, KEYLIST } from '../data'
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  IOnValidateBeforeChange,
  TDataSource,
  TInputFormEvent,
  TInputProps,
  TOnComplete,
  TOnChange,
  TOnValidateBeforeChange
} from '../types'
import { Utils } from '../utils'

export interface IUseBlockCodeProps {
  /**
   * Call when values got changed
   */
  onValuesChange?: TOnChange<string[]>
  /**
   * Call when onInput and onKeyDown
   */
  onInputChange?: TOnChange<TInputFormEvent>
  /**
   * Validate value before changing
   */
  onValidateBeforeChange?: TOnValidateBeforeChange<string, TDataSource>
  /**
   * Only call when enough data
   */
  onComplete?: TOnComplete<string>
  /**
   * How many input we're gonna show
   * @default 6
   */
  maxInputs?: number
  /**
   * Input props pass to input element
   */
  inputProps?: TInputProps
  /**
   * Auto focus to the first input
   * @default true
   */
  autoFocus?: boolean
}

export const useBlockCode = (props: IUseBlockCodeProps = {}) => {
  const {
    onValuesChange,
    onValidateBeforeChange,
    onInputChange,
    onComplete,
    maxInputs = 6,
    inputProps,
    autoFocus = true
  } = props

  const InputProps = Object.assign({}, DEFAULT_INPUT_PROPS, inputProps)

  /**
   * Declare default values
   */
  const ids = useMemo(
    () => [...Array(maxInputs)].map(Utils.createId),
    [maxInputs]
  )
  const initState = useMemo(
    () => Array<string>(maxInputs).fill(EMPTY_VALUE),
    [maxInputs]
  )
  const initActiveIndex = useMemo(() => (autoFocus ? 0 : -1), [autoFocus])

  /**
   * Declare states
   */
  const [activeIndex, setActiveIndex] = useState<number>(initActiveIndex)
  const [values, setValues] = useState(initState)

  const refs = useRef<HTMLInputElement[]>([])

  /**
   * Reset values to initState which is empty
   */
  const onResetValues = useCallback(() => {
    setValues(initState)
  }, [initState])

  /**
   * Reset the state. It will reset:
   *
   * @values to initState
   * @index to 0
   */
  const onReset = useCallback(() => {
    onResetValues()
    setActiveIndex(0)
  }, [onResetValues])

  /**
   * Check if data is enough then call `onComplete`
   */
  const onEnoughData = useCallback(() => {
    const { maxLength } = InputProps

    if (maxLength) {
      const raw = values.filter(data => data)
      const value = raw.join(EMPTY_VALUE)
      const isEnoughData = value.length == maxInputs * maxLength

      if (isEnoughData && onComplete) {
        onComplete({ value, raw, onReset })
      }
    }
  }, [InputProps, maxInputs, onComplete, onReset, values])

  /**
   * Check the data if valid
   *
   * @param data Value which wants to be added into the state
   * @param onCallback Callback will be called after passing conditions
   */
  const onCheckValue = async (
    data: IOnValidateBeforeChange,
    onCallback: VoidFunction
  ) => {
    if (onValidateBeforeChange) {
      const isValid = await onValidateBeforeChange(data)

      isValid && onCallback()
    } else {
      onCallback()
    }
  }

  /**
   *  Add a new data to the state, however it must fits the condition from `onValidateBeforeChange`
   *
   * @param data Data which wants to be added into the state
   * @param forIndex The index we want to set value for
   * @param onCallback Callback will be called after adding value
   */
  const onAddValue = (
    data: IOnValidateBeforeChange,
    forIndex: number,
    onCallback?: VoidFunction
  ) => {
    onCheckValue(data, () => {
      onSetValueAtIndex(data.value, forIndex)
      onCallback && onCallback()
    })
  }

  /**
   *  Trigger `onInputChange` to the user
   *
   * @param event The event which makes values got changed
   */
  const onAfterAddingValue = (event: TInputFormEvent) => {
    onInputChange && onInputChange(event)
  }

  /**
   *  Add ref to the refs array so we can control later
   *
   * @param index Index of the input
   * @param ref Ref of the input
   */
  const onCreateRef = (index: number, ref: HTMLInputElement) => {
    refs.current[index] = ref
  }

  /**
   * Update state values
   * @param value A new value of the input
   * @param forIndex The index we want to set value for
   */
  const onSetValueAtIndex = (value: string, forIndex: number) => {
    setValues(prevState => {
      const newState = [...prevState]
      newState[forIndex] = value
      return newState
    })
  }

  /**
   * Check if the index is valid, not smaller than 0 and greater than `maxInputs`
   *
   * If fits the condition then call `setActiveIndex`
   */
  const onSetActiveIndex = useCallback(
    (index: number) => {
      const nextActiveIndex = Math.max(Math.min(maxInputs - 1, index), 0)
      setActiveIndex(nextActiveIndex)
    },
    [maxInputs]
  )

  /**
   * Focus to the next input
   */
  const onNextFocusAfterChangingValue = useCallback(
    (value: string) => {
      const { maxLength } = InputProps
      const { length } = value

      if (maxLength) {
        const index = Utils.findIndex(activeIndex, length, maxLength, maxInputs)
        onSetActiveIndex(index)
      }
    },
    [InputProps, activeIndex, maxInputs, onSetActiveIndex]
  )

  /**
   * Detect the user change values
   * @param event FormEvent
   */
  const onInput: TOnChange<FormEvent<HTMLInputElement>> = event => {
    const { value } = event.currentTarget

    onAddValue({ value, event }, activeIndex, () => {
      onNextFocusAfterChangingValue(value)
      onAfterAddingValue(event)
    })
  }

  /**
   * Detect the user paste values into the input
   * @param event ClipboardEvent
   */
  const onPaste: TOnChange<ClipboardEvent<HTMLInputElement>> = async event => {
    event.preventDefault()
    const { maxLength } = InputProps

    if (maxLength) {
      const originaltext = await navigator.clipboard.readText()
      const trim = originaltext.trim()
      const chunk = Utils.createChunk(trim, maxLength)

      if (chunk) {
        let index = activeIndex

        for (let i = activeIndex; i < maxInputs; i++) {
          const value = chunk.shift()

          if (value) {
            onAddValue({ value, event }, i)
            index = i
          }
        }

        onSetActiveIndex(index)
      }
    }
  }

  /**
   * Detect the user press a key
   * @param event KeyboardEvent
   */
  const onKeyDown: TOnChange<KeyboardEvent<HTMLInputElement>> = event => {
    let index = activeIndex
    const { key } = event
    const isInKeyList = Object.values(KEYLIST).includes(key)
    const isDelete = [KEYLIST.BACK_SPACE, KEYLIST.DELETE].includes(key)

    if (isInKeyList) event.preventDefault()

    if (isDelete) {
      onSetValueAtIndex(EMPTY_VALUE, activeIndex)
      onAfterAddingValue(event)
    }

    switch (key) {
      case KEYLIST.BACK_SPACE:
      case KEYLIST.DELETE:
      case KEYLIST.ARROW_LEFT:
        --index
        break
      case KEYLIST.ARROW_RIGHT:
        ++index
        break
    }

    if (isInKeyList) onSetActiveIndex(index)
  }

  /**
   *  A helper function to generate input props
   *
   * @param index Index of the input
   * @returns Input props
   */
  const onCreateInputProps = (index: number): TInputProps => {
    return {
      value: values[index],
      ref: ref => ref && onCreateRef(index, ref),
      onFocus: () => onSetActiveIndex(index),
      onKeyDown,
      onInput,
      onPaste,
      ...InputProps
    }
  }

  /**
   * When values got changed, we need to check if the data is enough?
   * If it's enough and fits all the condition
   * We'll call `onComplete` event
   */
  useEffect(() => {
    onEnoughData()
  }, [onEnoughData, values])

  /**
   * When `values` got changed, send it to the user
   */
  useEffect(() => {
    onValuesChange?.(values)
  }, [onValuesChange, values])

  /**
   * When `activeIndex` got changed, check and focus to the next input
   */
  useEffect(() => {
    const element = refs.current[activeIndex]

    if (element) {
      element.focus()
      element.select()
    }
  }, [activeIndex])

  return {
    values,
    setValues,
    setActiveIndex,
    refs,
    onSetValueAtIndex,
    onSetActiveIndex,
    onResetValues,
    onReset,
    onPaste,
    onNextFocusAfterChangingValue,
    onKeyDown,
    onInput,
    onEnoughData,
    onCreateRef,
    onCreateInputProps,
    onCheckValue,
    onAfterAddingValue,
    onAddValue,
    initState,
    initActiveIndex,
    ids,
    activeIndex
  }
}
