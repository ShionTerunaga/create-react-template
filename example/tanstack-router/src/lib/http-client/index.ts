import { fetcher } from './fetcher-get'
import { resultUtility, type Result } from './utils/result'
import type { core, ZodType } from 'zod'
import { type Option } from './utils/option'

export interface HttpError {
  status: number
  message: string
  maxRetry: number
}

export const SpecificHttpErrorConst = {
  NotSetApiUrl: 'NotSetApiUrl',
  FetchFunctionError: 'FetchFunctionError',
  SchemeError: 'SchemeError',
  Else: 'Else',
} as const

export type SpecificHttpError =
  (typeof SpecificHttpErrorConst)[keyof typeof SpecificHttpErrorConst]

export function httpClient({
  baseUrl,
  baseHeaders,
  httpErrors,
}: {
  baseUrl: string
  baseHeaders: Record<string, string>
  httpErrors: HttpError[]
}) {
  const { isNG, checkResultReturn } = resultUtility

  const joinUrl = (baseUrl: string, endpoint: string): string => {
    const b = baseUrl.replace(/\/+$/, '')
    const e = endpoint.replace(/^\/+/, '')

    const url = `${b}/${e}`

    if (url.trim() === '') {
      throw new Error(`${url} must be a non-empty string`)
    }

    return url
  }

  const get = async <T extends ZodType>(
    endpoint: string,
    scheme: T,
    cache: RequestCache,
    maxRetry: number,
    requestHeaders = {},
  ) => {
    const headers = { ...baseHeaders, ...requestHeaders }

    const urlResult = checkResultReturn<string, Error>({
      fn: () => joinUrl(baseUrl, endpoint),
      err: new Error('Invalid URL'),
      maxRetry: 0,
    })

    if (isNG(urlResult)) {
      return urlResult
    }

    const url = urlResult.value

    const attempt = async (
      remaining: number,
    ): Promise<Result<Option<core.output<T>>, HttpError>> => {
      const res = await fetcher({
        url,
        scheme,
        cache,
        headers,
        maxRetry: remaining,
        httpErrors,
      })
      if (isNG(res) && remaining > 0) {
        return attempt(remaining - 1)
      }
      return res
    }

    return attempt(maxRetry)
  }

  return { get }
}
