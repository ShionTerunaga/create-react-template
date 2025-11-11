import { core, ZodError, ZodType } from 'zod'
import { type Option, optionUtility } from '@/utils/option'
import { type Result, resultUtility } from '@/utils/result'

import type { OnceError, RetryValue } from './fetcher'
import type { Dict } from '@/shared/types/object'

export async function fetcher<T extends ZodType, E>({
  url,
  scheme,
  cache,
  headers,
  fetchErrorHandler,
  schemaErrorHandler,
  maxRetry,
  retryErrors,
  onceErrors,
  unknownError,
}: {
  url: string
  scheme: T
  cache?: RequestCache
  headers?: Dict<string>
  maxRetry: number
  retryErrors: Array<RetryValue<NonNullable<E>>>
  onceErrors: Array<OnceError<NonNullable<E>>>
  fetchErrorHandler: (error: unknown) => Result<never, NonNullable<E>>
  schemaErrorHandler: (
    error: ZodError<core.output<T>>,
  ) => Result<never, NonNullable<E>>
  unknownError: NonNullable<E>
}): Promise<Result<Option<core.output<T>>, NonNullable<E>>> {
  const { isSome, createNone, createSome, optionConversion } = optionUtility
  const { isNG, checkPromiseReturn, createOk, createNg } = resultUtility

  const responseResult = await checkPromiseReturn<Response, NonNullable<E>>({
    fn: async () => await fetch(url, { cache, headers }),
    err: fetchErrorHandler,
  })

  if (isNG(responseResult)) {
    return responseResult
  }

  if (!responseResult.value.ok) {
    const matched = optionConversion(
      onceErrors.find(
        ({ httpStatus }) => httpStatus === responseResult.value.status,
      ),
    )

    if (isSome(matched)) {
      return createNg(matched.value.error)
    }

    const retryMatched = optionConversion(
      retryErrors.find(
        ({ httpStatus }) => httpStatus === responseResult.value.status,
      ),
    )

    if (maxRetry === 0 && isSome(retryMatched)) {
      return createNg(retryMatched.value.error)
    }

    if (isSome(retryMatched)) {
      return await fetcher({
        url,
        scheme,
        cache,
        headers,
        maxRetry: maxRetry - 1,
        fetchErrorHandler,
        schemaErrorHandler,
        retryErrors: retryErrors,
        onceErrors: onceErrors,
        unknownError,
      })
    }

    return createNg(unknownError)
  }

  const resValue = await responseResult.value.json()

  const judgeType = scheme.safeParse(resValue)

  if (judgeType.error) {
    return schemaErrorHandler(judgeType.error)
  }

  const okValue = judgeType.data

  if (okValue === undefined || okValue === null) {
    return createOk(createNone())
  }

  return createOk(createSome(okValue))
}
