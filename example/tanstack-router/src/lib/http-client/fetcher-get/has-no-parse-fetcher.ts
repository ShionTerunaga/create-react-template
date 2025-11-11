import z from 'zod'
import { type Option } from '../utils/option'
import { type Result } from '../utils/result'
import { fetcher } from './fetcher'
import type { HttpError } from '../index'

export async function hasNoParseFetcher<T extends z.ZodType>({
  url,
  scheme,
  cache,
  headers,
  maxRetry,
  httpErrors,
}: {
  url: string
  scheme: T
  cache?: RequestCache
  headers?: Record<string, string>
  maxRetry: number
  httpErrors: HttpError[]
}): Promise<Result<Option<z.infer<T>>, HttpError>> {
  return await fetcher<T>({
    url,
    scheme,
    cache,
    headers,
    maxRetry,
    httpErrors,
  })
}
