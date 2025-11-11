import { hasNoParseFetcher } from '../../../lib/http-client/fetcher-get/has-no-parse-fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()

describe('hasNoParseFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  it('propagates schema error (422) when parse fails', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ a: 1 }),
    })
    const schema = z.object({ b: z.number() })
    const result = await hasNoParseFetcher({
      url: 'https://example.com',
      scheme: schema,
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 0 },
        { status: 0, message: 'Unknown', maxRetry: 0 },
      ],
      maxRetry: 0,
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
      url: 'https://example.com',
      scheme: schema,
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 0 },
        { status: 0, message: 'Unknown', maxRetry: 0 },
      ],
      maxRetry: 0,
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
      url: 'https://example.com',
      scheme: schema,
      headers,
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 0 },
        { status: 0, message: 'Unknown', maxRetry: 0 },
      ],
      maxRetry: 0,
    })

    expect(result.kind).toBe('ok')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
    )
  })

  it('returns ng on first rejection (no internal retry logic)', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ a: 2 }),
      })

    const schema = z.object({ a: z.number() })
    const result = await hasNoParseFetcher({
      url: 'https://example.com',
      scheme: schema,
      maxRetry: 1,
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 1 },
        { status: 0, message: 'Unknown', maxRetry: 1 },
      ],
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
