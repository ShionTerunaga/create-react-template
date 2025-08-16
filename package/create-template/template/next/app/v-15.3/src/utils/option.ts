export const OPTION_SOME = "some" as const;
export const OPTION_NONE = "none" as const;

interface Some<T> {
  readonly kind: typeof OPTION_SOME;
  value: T;
}

interface None {
  readonly kind: typeof OPTION_NONE;
}

export type Option<T> = Some<T> | None;

export const createOption = {
  some: <T>(value: T): Option<T> => {
    return {
      kind: OPTION_SOME,
      value,
    };
  },
  none: () => {
    return {
      kind: OPTION_NONE,
    };
  },
};
