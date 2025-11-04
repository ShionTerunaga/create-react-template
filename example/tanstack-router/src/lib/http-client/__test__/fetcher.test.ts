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
})
