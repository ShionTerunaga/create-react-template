import { describe, it, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'
import { fetcher } from '../../../lib/http-client/fetcher-get/fetcher'
import { resultUtility } from '../../../lib/http-client/utils/result'

interface HttpError {
  status: number
  message: string
  maxRetry: number
}

const createHttpError = (
  status: number,
  message: string,
  maxRetry = 0,
): HttpError => ({
  status,
  message,
  maxRetry,
})

describe('fetcher', () => {
  const OK_SCHEMA = z.object({ id: z.number(), name: z.string() })
  const ERROR_SCHEMA = z.object({ foo: z.string() })

  const HTTP_ERRORS: HttpError[] = [
    createHttpError(404, 'Not Found'),
    createHttpError(500, 'Server Error'),
    createHttpError(422, 'Schema Error'),
    createHttpError(0, 'Unknown'),
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ok some when schema parse succeeds', async () => {
    const data = { id: 1, name: 'test' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(data), { status: 200 }),
    )
    const result = await fetcher({
      url: 'https://example.com',
      scheme: OK_SCHEMA,
      httpErrors: HTTP_ERRORS,
      maxRetry: 0,
    })
    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') {
      expect(result.value.kind).toBe('some')
      if (result.value.kind === 'some') {
        expect(result.value.value).toEqual(data)
      }
    }
  })

  it('returns 422 error when schema parse fails', async () => {
    const data = { id: 1, name: 'test' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(data), { status: 200 }),
    )
    const result = await fetcher({
      url: 'https://example.com',
      scheme: ERROR_SCHEMA,
      httpErrors: HTTP_ERRORS,
      maxRetry: 0,
    })
    expect(result.kind).toBe('ng')
    if (resultUtility.isNG(result)) {
      expect(result.err.status).toBe(422)
    }
  })

  it('returns matched http error on fetch rejection', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Server Error'))
    const result = await fetcher({
      url: 'https://example.com',
      scheme: OK_SCHEMA,
      httpErrors: HTTP_ERRORS,
      maxRetry: 0,
    })
    expect(result.kind).toBe('ng')
    if (resultUtility.isNG(result)) {
      expect(result.err.status).toBe(0)
    }
  })

  it('returns fallback http error when no match on fetch rejection', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('X'))
    const result = await fetcher({
      url: 'https://example.com',
      scheme: OK_SCHEMA,
      httpErrors: HTTP_ERRORS,
      maxRetry: 3,
    })
    expect(result.kind).toBe('ng')
    if (resultUtility.isNG(result)) {
      expect(result.err.status).toBe(0)
      expect(result.err.maxRetry).toBe(3)
    }
  })

  it('returns none when response json is null', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(null), { status: 200 }),
    )
    const result = await fetcher({
      url: 'https://example.com',
      scheme: z.any(),
      httpErrors: HTTP_ERRORS,
      maxRetry: 0,
    })
    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') {
      expect(result.value.kind).toBe('none')
    }
  })
})
