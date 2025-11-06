import { hasParseFetcher } from '../fetcher-get/has-parse-fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionUtility } from '../utils/option'
import { resultUtility } from '../utils/result'
import { createHttpError } from '../utils/error/http/http'

const mockFetch = vi.fn()

describe('hasParseFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const { createSome } = optionUtility
  const { createOk } = resultUtility
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

    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      parse: () => createOk(createSome('ok')),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns parse result when fetcher ok', async () => {
    const payload = { a: 1 }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    })

    const schema = z.object({ a: z.number() })

    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      parse: () => createOk(createSome('parsed')),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') expect(result.value.kind).toBe('some')
    if (result.kind === 'ok' && result.value.kind === 'some')
      expect(result.value.value).toBe('parsed')
  })

  it('retries when fetcher initially fails and eventually succeeds', async () => {
    const payload = { a: 1 }
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => payload,
      })

    const schema = z.object({ a: z.number() })

    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 1,
      parse: () => createOk(createSome('retried')),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledTimes(2)
    if (result.kind === 'ok') expect(result.value.kind).toBe('some')
    if (result.kind === 'ok' && result.value.kind === 'some')
      expect(result.value.value).toBe('retried')
  })

  it('returns ng when retries exhausted', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const schema = z.object({})

    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 2,
      parse: () => createOk(createSome('nope')),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(3)
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

    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      headers,
      parse: () => createOk(createSome('parsed')),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
    )
  })

  it('does not retry when maxRetry is undefined', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const schema = z.object({})
    const parseMock = vi.fn(() => createOk(createSome('unused')))
    const result = await hasParseFetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      parse: parseMock,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(parseMock).not.toHaveBeenCalled()
  })
})
