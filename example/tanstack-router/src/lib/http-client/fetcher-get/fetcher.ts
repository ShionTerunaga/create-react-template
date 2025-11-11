import { core, ZodType } from 'zod'
import { type Option, optionUtility } from '../utils/option'
import { type Result, resultUtility } from '../utils/result'

import { type HttpError } from '..'

const FALLBACK_MESSAGE =
  'unexpected error. The httpErrors argument may not contain sufficient error cases.'

export async function fetcher<T extends ZodType>({
  url,
  scheme,
  cache,
  headers,
  httpErrors,
  maxRetry,
}: {
  url: string
  scheme: T
  cache?: RequestCache
  headers?: Record<string, string>
  maxRetry: number
  httpErrors: HttpError[]
}): Promise<Result<Option<core.output<T>>, HttpError>> {
  const { createNone, createSome } = optionUtility
  const { isNG, createNg, createOk } = resultUtility

  const responseResult = await (async () => {
    try {
      const response = await fetch(url, { cache, headers })
      return createOk(response)
    } catch (caught: unknown) {
      const matched = httpErrors.find(
        (e) =>
          typeof (caught as any)?.status === 'number' &&
          e.status === (caught as any).status,
      )
      return createNg(
        matched ?? { status: 0, message: FALLBACK_MESSAGE, maxRetry },
      )
    }
  })()

  if (isNG(responseResult)) {
    return responseResult
  }

  const resValue = await responseResult.value.json()

  const judgeType = scheme.safeParse(resValue)

  if (judgeType.error) {
    const schemaErr = httpErrors.find((e) => e.status === 422)
    return createNg(
      schemaErr ?? { status: 422, message: FALLBACK_MESSAGE, maxRetry },
    )
  }

  const okValue = judgeType.data

  if (okValue === undefined || okValue === null) {
    return createOk(createNone())
  }

  return createOk(createSome(okValue))
}
