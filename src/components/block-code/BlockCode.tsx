import { VFC } from 'react'
import { IUseBlockCodeProps, useBlockCode } from '../../hooks'

export interface IBlockCodeProps extends IUseBlockCodeProps {
  className?: string
}

export const BlockCode: VFC<IBlockCodeProps> = props => {
  const { className, ...restProps } = props
  const { ids, onCreateInputProps } = useBlockCode(restProps)

  return (
    <div className={className}>
      {ids.map((id, index) => (
        <input key={id} {...onCreateInputProps(index)} />
      ))}
    </div>
  )
}
