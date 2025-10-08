import { type ChildrenOnly } from '@/shared/types/react'
import { type BoxStyle } from './box.type'
import { boxVariants } from './box.css'
import type { CheckerProps } from '@/shared/types/object'

interface BoxProps extends BoxStyle, ChildrenOnly {}

export function Box<T extends BoxProps>(
  props: CheckerProps<T, BoxProps, 'Box Props Error'>,
) {
  const {
    as = 'div',
    width = 'auto',
    height = 'auto',
    boxShadow = 'none',
    color = 'white',
    border = 'none',
    borderRadius = 'none',
    style,
    children,
  } = props

  const cn = [
    boxVariants.boxWidthStyle[width],
    boxVariants.boxHeightStyle[height],
    boxVariants.boxShadowStyle[boxShadow],
    boxVariants.colorStyle[color],
    boxVariants.border[border],
    boxVariants.boxBorderRadiusStyle[borderRadius],
  ].join(' ')

  const As = as

  return (
    <As className={cn} style={style}>
      {children}
    </As>
  )
}
