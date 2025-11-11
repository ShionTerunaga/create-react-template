import { hasParseFetcher } from '../../../lib/http-client/fetcher-get/has-parse-fetcher'
import { z } from 'zod'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resultUtility } from '../../../lib/http-client/utils/result'

const mockFetch = vi.fn()

describe('hasParseFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const { createOk } = resultUtility

  it('returns schema error when parse fails', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ a: 1 }),
    })
    const schema = z.object({ b: z.number() })
    const result = await hasParseFetcher({
      url: 'https://example.com',
      scheme: schema,
      parse: () => createOk({ kind: 'none' } as any),
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 0 },
        { status: 0, message: 'Unknown', maxRetry: 0 },
      ],
      maxRetry: 0,
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
      url: 'https://example.com',
      scheme: schema,
      parse: () => createOk({ kind: 'some', value: 'parsed' } as any),
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 0 },
        { status: 0, message: 'Unknown', maxRetry: 0 },
      ],
      maxRetry: 0,
    })

    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') expect(result.value.kind).toBe('some')
    if (result.kind === 'ok' && result.value.kind === 'some')
      expect(result.value.value).toBe('parsed')
  })

  it('returns ng on fetch rejection (no internal retry)', async () => {
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
      url: 'https://example.com',
      scheme: schema,
      maxRetry: 1,
      parse: () => createOk({ kind: 'some', value: 'retried' } as any),
      httpErrors: [
        { status: 422, message: 'Schema Error', maxRetry: 1 },
        { status: 0, message: 'Unknown', maxRetry: 1 },
      ],
    })

    expect(result.kind).toBe('ng')
    expect(mockFetch).toHaveBeenCalledTimes(1)
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
      url: 'https://example.com',
      scheme: schema,
      headers,
      parse: () => createOk({ kind: 'some', value: 'parsed' } as any),
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
})
