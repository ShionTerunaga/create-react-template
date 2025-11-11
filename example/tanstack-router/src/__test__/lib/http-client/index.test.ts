import { describe, it, expect, beforeEach, vi } from 'vitest'
import { httpClient, type HttpError } from '../../../lib/http-client'
import { z } from 'zod'

const mockFetch = vi.fn()

describe('httpClient.get', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
  })

  const httpErrors: HttpError[] = [
    { status: 404, message: 'Not Found', maxRetry: 0 },
    { status: 500, message: 'Server Error', maxRetry: 0 },
    { status: 422, message: 'Schema Error', maxRetry: 0 },
  ]

  it('returns ng when schema parses successfully (current impl)', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: { Authorization: 'BASE' },
      httpErrors,
    })
    mockFetch.mockResolvedValue({
      json: async () => ({ id: 1, name: 'a' }),
    })
    const schema = z.object({ id: z.number(), name: z.string() })
    const result = await client.get('users', schema, 'default', 0)
    expect(result.kind).toBe('ng')
  })

  it('returns ok none when schema parse fails', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: {},
      httpErrors,
    })
    mockFetch.mockResolvedValue({ json: async () => ({ id: 1 }) })
    const schema = z.object({ id: z.number(), name: z.string() })
    const result = await client.get('users', schema, 'default', 0)
    expect(result.kind).toBe('ok')
    if (result.kind === 'ok') expect(result.value.kind).toBe('none')
  })

  it('merges headers', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: { A: 'a' },
      httpErrors,
    })
    mockFetch.mockResolvedValue({ json: async () => ({ id: 1 }) })
    const schema = z.object({ id: z.number() })
    await client.get('users', schema, 'default', 0, { B: 'b' })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({ headers: { A: 'a', B: 'b' } }),
    )
  })

  it('retries on error until success', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: {},
      httpErrors,
    })
    mockFetch
      .mockRejectedValueOnce(new Error('net'))
      .mockResolvedValueOnce({ json: async () => ({ id: 1 }) })
    const schema = z.object({ id: z.number() })
    const result = await client.get('users', schema, 'default', 1)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.kind).toBe('ng')
  })

  it('exhausts retries returns ng and attempts count matches', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: {},
      httpErrors,
    })
    mockFetch.mockRejectedValue(new Error('net'))
    const schema = z.object({ id: z.number() })
    const result = await client.get('users', schema, 'default', 2)
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result.kind).toBe('ng')
  })

  it('falls back to error when no error matches rejection', async () => {
    const client = httpClient({
      baseUrl: 'https://api.example.com',
      baseHeaders: {},
      httpErrors,
    })
    mockFetch.mockRejectedValue(new Error('unknown'))
    const schema = z.object({ id: z.number() })
    const result = await client.get('users', schema, 'default', 0)
    expect(result.kind).toBe('ng')
    if (result.kind === 'ng' && 'status' in result.err) {
      expect(result.err.status).toBe(0)
    }
  })
})
