import '../themes/styles.scss'
import { ComponentMeta } from '@storybook/react'
import { BlockCode } from '../components'
import { BlockCodeTemplate, DefaultArgs } from './Base.shared'

export default {
  component: BlockCode,
  title: 'Block Code Theme',
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

export const Underline = BlockCodeTemplate.bind({})
Underline.args = {
  ...DefaultArgs,
  className: 'block-code-underline'
}

export const Circular = BlockCodeTemplate.bind({})
Circular.args = {
  ...DefaultArgs,
  className: 'block-code-circular'
}
