import { fetcher } from '../fetcher-get'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionUtility } from '@/utils/option'
import { createHttpError } from '../utils/error/http/http'

const mockFetch = vi.fn()

describe('fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const { createSome, createNone } = optionUtility
  const defaultErrorHandler = (status: number) => {
    switch (status) {
      default:
        return createHttpError.returnInternalServerError
    }
  }

  it('returns ng when url is none', async () => {
    const result = await fetcher({
      url: createNone(),
      scheme: z.object({}),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ng when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ng when schema validation fails', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ foo: 1 }),
    })

    const schema = z.object({ bar: z.string() })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
  })

  it('returns ok when everything is fine', async () => {
    const body = { bar: 'hello' }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => body,
    })

    const schema = z.object({ bar: z.string() })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') {
      expect(result.value.kind).toBe('some')
      if (result.value.kind === 'some') {
        expect(result.value.value).toEqual(body)
      }
    }
  })

  it('passes headers when provided', async () => {
    const body = { bar: 'h' }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => body,
    })

    const schema = z.object({ bar: z.string() })

    const headers = { 'X-Test': 'abc' }

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      headers,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ headers: { 'X-Test': 'abc' } }),
    )
  })

  it('retries on fetch promise rejection and eventually succeeds', async () => {
    const body = { bar: 'after-retry' }
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => body,
      })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({ bar: z.string() }),
      maxRetry: 1,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('fails after exhausting retries on fetch promise rejection', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
      maxRetry: 2,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  it('does not retry on non-ok status even with maxRetry', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
      maxRetry: 3,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does not retry on non-ok status even with maxRetry', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
      maxRetry: 3,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('does not retry on schema validation failure even with maxRetry', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ foo: 1 }),
    })

    const schema = z.object({ bar: z.string() })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: schema,
      maxRetry: 2,
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('uses errorHandler return value as error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    })

    const result = await fetcher({
      url: createSome('https://example.com'),
      scheme: z.object({}),
      errorHandler: defaultErrorHandler,
    })

    expect(result.kind).toBe('ng')
    if (result.kind === 'ng') {
      expect(result.err).toBe(createHttpError.returnInternalServerError)
    }
  })
})
