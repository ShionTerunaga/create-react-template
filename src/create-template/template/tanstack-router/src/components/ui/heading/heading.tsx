import { headingFontStyle } from './heading.css'
import type { CheckerProps } from '@/shared/types/object'
import type { HeadingStyle } from './heading.type'
import type { ChildrenOnly } from '@/shared/types/react'
import { textColor } from '@/shared/theme/design-system.css'

interface HeadingProps extends HeadingStyle, ChildrenOnly {}

export function Heading<T extends HeadingProps>(
  props: CheckerProps<T, HeadingProps, 'Heading Props Error'>,
) {
  const {
    as = 'h1',
    fontStyle = 'firstBig',
    color = 'textNormal',
    children,
  } = props

  const cn = [headingFontStyle[fontStyle], textColor[color]].join(' ')

  const As = as
  return <As className={cn}>{children}</As>
}
