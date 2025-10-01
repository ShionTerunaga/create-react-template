/* eslint-disable @typescript-eslint/naming-convention */
const RESULT_OK = 'ok' as const
const RESULT_NG = 'ng' as const

interface OK<T> {
  readonly kind: typeof RESULT_OK
  value: T
}

interface NG<E> {
  readonly kind: typeof RESULT_NG
  err: E
}

type Result<T, E> = OK<T> | NG<E>

const createResult = {
  ok: <T>(value: T): Result<T, never> => {
    return {
      kind: RESULT_OK,
      value,
    }
  },

  ng: <E>(err: E): Result<never, E> => {
    return {
      kind: RESULT_NG,
      err,
    }
  },
}

export type { Result }
export { createResult, RESULT_NG, RESULT_OK }
