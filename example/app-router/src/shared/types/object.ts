/**
 * 柔軟なオブジェクト
 */
export type Dict<T> = Record<string, T>;

export type CheckerProps<T, TExpect, TError extends string> = T &
    (Exclude<keyof T, keyof TExpect> extends never ? object : TError);
