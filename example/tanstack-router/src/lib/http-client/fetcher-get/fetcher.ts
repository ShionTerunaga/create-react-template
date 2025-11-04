import { core, ZodType } from 'zod'
import { type Option, optionUtility } from '../utils/option'
import { type Result, resultUtility } from '../utils/result'
import { createFetcherError, type FetcherError } from '../utils/error/fetcher'
import { type HttpError } from '../utils/error/http'

export async function fetcher<T extends ZodType>({
  url,
  scheme,
  cache,
  errorHandler,
}: {
  url: Option<string>
  scheme: T
  cache?: RequestCache
  errorHandler: (status: number) => HttpError
}): Promise<Result<Option<core.output<T>>, FetcherError>> {
  const { returnNotSetApiUrl, returnSchemeError, returnFetchFunctionError } =
    createFetcherError

  const { isNone, createNone, createSome } = optionUtility
  const { isNG, createNg, createOk, checkPromiseReturn } = resultUtility

  if (isNone(url)) {
    return createNg(returnNotSetApiUrl)
  }

  const res = await checkPromiseReturn({
    fn: () => fetch(url.value, { cache }),
    err: returnFetchFunctionError,
  })

  if (isNG(res)) {
    return res
  }

  if (!res.value.ok) {
    const status = res.value.status
    const httpError = errorHandler(status)

    return createNg(httpError)
  }

  const resValue = await res.value.json()

  const judgeType = scheme.safeParse(resValue)

  if (judgeType.error !== undefined) {
    return createNg(returnSchemeError)
  }

  const okValue = judgeType.data

  if (okValue === undefined || okValue === null) {
    return createOk(createNone())
  }

  return createOk(createSome(okValue))
}
