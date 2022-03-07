import {
  ClipboardEvent,
  DetailedHTMLProps,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent
} from 'react'

interface ICompleteValue<T = string> {
  /**
   * Value to return
   */
  value: T
  /**
   * Raw value from the state
   */
  raw: T[]
  /**
   * A function to reset states and activeIndex
   */
  onReset: VoidFunction
}

interface IOnValidateBeforeChange<R = string, E = TDataSource> {
  value: R
  event: E
}
type TInputFormEvent = FormEvent<HTMLInputElement>

type TInputKeyboardEvent = KeyboardEvent<HTMLInputElement>

type TInputClipboardEvent = ClipboardEvent<HTMLInputElement>

type TDataSource = TInputFormEvent | TInputKeyboardEvent | TInputClipboardEvent

type TOnValidateBeforeChange<R, E> = (
  data: IOnValidateBeforeChange<R, E>
) => Promise<boolean>

type TOnChange<T> = (any: T) => void

type TOnComplete<T> = (data: ICompleteValue<T>) => void

type TInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type {
  TOnValidateBeforeChange,
  TOnChange,
  TOnComplete,
  TInputProps,
  TInputKeyboardEvent,
  TInputFormEvent,
  TInputClipboardEvent,
  TDataSource,
  IOnValidateBeforeChange,
  ICompleteValue
}
