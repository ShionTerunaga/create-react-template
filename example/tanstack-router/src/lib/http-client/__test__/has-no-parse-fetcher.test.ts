import { hasNoParseFetcher } from '../fetcher-get/has-no-parse-fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionUtility } from '../utils/option'
import { createHttpError } from '../utils/error/http/http'

const mockFetch = vi.fn()

describe('hasNoParseFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const { createSome } = optionUtility
  const defaultErrorHandler = (status: number) => {
    switch (status) {
      default:
        return createHttpError.returnInternalServerError
    }
  }

  it('propagates ng from fetcher', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const schema = z.object({})

    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ok when fetcher succeeds', async () => {
    const payload = { a: 1 }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    })

    const schema = z.object({ a: z.number() })

    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') {
      expect(result.value.kind).toBe('some')
      if (result.value.kind === 'some') {
        expect(result.value.value).toEqual(payload)
      }
    }
  })

  it('passes headers through to fetcher', async () => {
    const payload = { a: 1 }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    })

    const schema = z.object({ a: z.number() })

    const headers = { Authorization: 'Bearer token' }

    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      headers,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
    )
  })

  it('retries on fetch rejection and succeeds', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ a: 2 }),
      })

    const schema = z.object({ a: z.number() })
    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 1,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('exhausts retries on repeated rejections', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const schema = z.object({})
    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 2,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('does not retry on non-ok status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const schema = z.object({})
    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 3,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does not retry when maxRetry is undefined', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const schema = z.object({})
    const result = await hasNoParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
