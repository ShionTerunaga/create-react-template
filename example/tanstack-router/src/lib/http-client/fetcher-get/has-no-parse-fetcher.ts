import z from 'zod'
import { type Option } from '../utils/option'
import { type Result } from '../utils/result'
import { fetcher } from './fetcher'
import { type FetcherError } from '../utils/error/fetcher'
import type { HttpError } from '../utils/error/http'

export async function hasNoParseFetcher<T extends z.ZodType>({
  url,
  scheme,
  cache,
  headers,
  maxRetry,
  errorHandler,
}: {
  url: Option<string>
  scheme: T
  cache?: RequestCache
  headers?: Record<string, string>
  maxRetry?: number
  errorHandler: (status: number) => HttpError
}): Promise<Result<Option<z.infer<T>>, FetcherError>> {
  return await fetcher<T>({
    url,
    scheme,
    cache,
    headers,
    maxRetry,
    errorHandler,
  })
}
