export const RESULT_OK = "ok" as const;
export const RESULT_NG = "ng" as const;

interface OK<T> {
  readonly kind: typeof RESULT_OK;
  value: T;
}

interface NG<E> {
  readonly kind: typeof RESULT_NG;
  err: E;
}

export type Result<T, E> = OK<T> | NG<E>;

export const createResult = {
  ok: <T>(value: T): Result<T, never> => {
    return {
      kind: RESULT_OK,
      value,
    };
  },
  ng: <E>(err: E): Result<never, E> => {
    return {
      kind: RESULT_NG,
      err,
    };
  },
};
