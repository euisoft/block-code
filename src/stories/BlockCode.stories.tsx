import '../themes/default.scss'
import { ComponentMeta } from '@storybook/react'
import { BlockCode } from '../components'
import { isNumeric } from '../plugins'
import {
  BlockCodeTemplate,
  DefaultArgs,
  logOnValidateBeforeChange
} from './Base.shared'

export default {
  component: BlockCode,
  title: 'Block Code',
  argTypes: {
    maxInputs: {
      control: {
        type: 'number',
        min: 1
      }
    }
  }
} as ComponentMeta<typeof BlockCode>

export const Default = BlockCodeTemplate.bind({})
Default.args = DefaultArgs

export const MaxInputs = BlockCodeTemplate.bind({})
MaxInputs.args = {
  ...DefaultArgs,
  maxInputs: 8
}

export const MaxLength = BlockCodeTemplate.bind({})
MaxLength.args = {
  ...DefaultArgs,
  inputProps: {
    maxLength: 2
  }
}

export const NumberOnly = BlockCodeTemplate.bind({})
NumberOnly.args = {
  ...DefaultArgs,
  onValidateBeforeChange: async data =>
    logOnValidateBeforeChange(data, isNumeric(data.value))
}

export const Disabled = BlockCodeTemplate.bind({})
Disabled.args = {
  ...DefaultArgs,
  inputProps: {
    disabled: true
  }
}

export const Secure = BlockCodeTemplate.bind({})
Secure.args = {
  ...DefaultArgs,
  inputProps: {
    type: 'password'
  }
}

export const SecureWithNumberOnly = BlockCodeTemplate.bind({})
SecureWithNumberOnly.args = {
  ...DefaultArgs,
  onValidateBeforeChange: async data =>
    logOnValidateBeforeChange(data, isNumeric(data.value)),
  inputProps: {
    type: 'password'
  }
}

export const Placeholder = BlockCodeTemplate.bind({})
Placeholder.args = {
  ...DefaultArgs,
  inputProps: {
    placeholder: '-'
  }
}

export const PlaceholderIcon = BlockCodeTemplate.bind({})
PlaceholderIcon.args = {
  ...DefaultArgs,
  inputProps: {
    placeholder: '🥺'
  }
}
