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
})
