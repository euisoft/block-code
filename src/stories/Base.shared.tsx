import { FormEvent } from 'react'
import { ComponentStory } from '@storybook/react'
import { IBlockCodeProps, BlockCode } from '../components'
import { ICompleteValue, IOnValidateBeforeChange } from '../types'

const logOnValidateBeforeChange = (
  data: IOnValidateBeforeChange,
  isValid: boolean
) => {
  console.log('async.onValidateBeforeChange', data)
  console.log('async.onValidateBeforeChange.isValid', isValid)
  return isValid
}

const logOnInputChange = (event: FormEvent<HTMLInputElement>) =>
  console.log('onInputChange', event)

const logOnValuesChange = (data: string[]) =>
  console.log('onValuesChange', data)

const logOnComplete = (event: ICompleteValue<string>) =>
  console.log('onComplete', event)

const DefaultArgs: Partial<IBlockCodeProps> = {
  className: 'block-code-default',
  onValuesChange: logOnValuesChange,
  onInputChange: logOnInputChange,
  onComplete: logOnComplete,
  onValidateBeforeChange: async value => logOnValidateBeforeChange(value, true),
  maxInputs: 6
}

const BlockCodeTemplate: ComponentStory<typeof BlockCode> = agrs => (
  <BlockCode {...agrs} />
)

export {
  DefaultArgs,
  BlockCodeTemplate,
  logOnValidateBeforeChange,
  logOnInputChange,
  logOnComplete
}
