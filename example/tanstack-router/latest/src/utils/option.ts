const OPTION_SOME = 'some' as const
const OPTION_NONE = 'none' as const

interface Some<T> {
  readonly kind: typeof OPTION_SOME
  value: T
}

interface None {
  readonly kind: typeof OPTION_NONE
}

type Option<T> = Some<T> | None

const createOption = {
  some: <T>(value: T): Option<T> => {
    return {
      kind: OPTION_SOME,
      value,
    }
  },
  none: () => {
    return {
      kind: OPTION_NONE,
    }
  },
}

export type { Option }

export { createOption, OPTION_SOME, OPTION_NONE }
