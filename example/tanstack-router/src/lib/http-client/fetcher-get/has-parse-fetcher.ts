import { core, ZodType } from 'zod'
import { type Option, optionUtility } from '../utils/option'
import { resultUtility, type Result } from '../utils/result'
import { fetcher } from './fetcher'
import type { HttpError } from '../index'

export async function hasParseFetcher<T extends ZodType, S>({
  url,
  scheme,
  cache,
  headers,
  maxRetry,
  parse,
  httpErrors,
}: {
  url: string
  scheme: T
  cache?: RequestCache
  headers?: Record<string, string>
  maxRetry: number
  parse: (scheme: core.output<T>) => Result<Option<S>, HttpError>
  httpErrors: HttpError[]
}): Promise<Result<Option<S>, HttpError>> {
  const { isNG, createOk } = resultUtility
  const { isNone, createNone } = optionUtility

  const fetcherResult = await fetcher<T>({
    url,
    scheme,
    cache,
    headers,
    maxRetry,
    httpErrors,
  })

  if (isNG(fetcherResult)) {
    return fetcherResult
  }

  if (isNone(fetcherResult.value)) {
    return createOk(createNone())
  }

  return parse(fetcherResult.value.value)
}
