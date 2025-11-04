import { core, ZodType } from 'zod'
import { type Option, optionUtility } from '../utils/option'
import { resultUtility, type Result } from '../utils/result'
import { fetcher } from './fetcher'
import { type FetcherError } from '../utils/error/fetcher/fetcher-error'
import type { HttpError } from '../utils/error/http'

export async function hasParseFetcher<T extends ZodType, S>({
  url,
  scheme,
  cache,
  maxRetry,
  parse,
  errorHandler,
}: {
  url: Option<string>
  scheme: T
  cache?: RequestCache
  maxRetry?: number
  parse: (scheme: core.output<T>) => Result<Option<S>, FetcherError>
  errorHandler: (status: number) => HttpError
}): Promise<Result<Option<S>, FetcherError>> {
  const { isNG, createOk } = resultUtility
  const { isNone, createNone } = optionUtility

  const fetcherResult = await fetcher<T>({
    url,
    scheme,
    cache,
    errorHandler,
  })

  if (isNG(fetcherResult)) {
    if (maxRetry && maxRetry > 0) {
      return hasParseFetcher({
        url,
        scheme,
        cache,
        maxRetry: maxRetry - 1,
        parse,
        errorHandler,
      })
    }
    return fetcherResult
  }

  if (isNone(fetcherResult.value)) {
    return createOk(createNone())
  }

  return parse(fetcherResult.value.value)
}
