import { createHttpError, HttpError } from '@/utils/error/http'
import { describe, expect, it } from 'vitest'

describe('http', () => {
  it('httpErrorクラスが正常に作られる', () => {
    const error = new HttpError({
      status: 4000,
      message: 'bad request',
    })

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(4000)
    expect(error.message).toBe('bad request')
  })

  it('createHttpErrorのnotFoundAPIUrlが正常に作られる', () => {
    const { notFoundAPIUrl } = createHttpError()
    const error = notFoundAPIUrl()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(4040)
    expect(error.message).toBe('APIのURLが設定されていません')
  })
  it('createHttpErrorのreturnNotFoundAPIUrlが正常に作られる', () => {
    const { returnNotFoundAPIUrl } = createHttpError()
    const error = returnNotFoundAPIUrl()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(4041)
    expect(error.message).toBe('APIのURLが見つかりません')
  })

  it('createHttpErrorのreturnNoPermissionが正常に作られる', () => {
    const { returnNoPermission } = createHttpError()
    const error = returnNoPermission()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(4030)
    expect(error.message).toBe('権限がありません')
  })

  it('createHttpErrorのreturnBadRequestが正常に作られる', () => {
    const { returnBadRequest } = createHttpError()
    const error = returnBadRequest()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(4000)
    expect(error.message).toBe('不正なリクエストです')
  })

  it('createHttpErrorのreturnInternalServerErrorが正常に作られる', () => {
    const { returnInternalServerError } = createHttpError()
    const error = returnInternalServerError()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(5001)
    expect(error.message).toBe('サーバーエラーです')
  })

  it('createHttpErrorのunknownErrorが正常に作られる', () => {
    const { unknownError } = createHttpError()
    const error = unknownError()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(9999)
    expect(error.message).toBe('unknown error')
  })
  it('createHttpErrorのschemeErrorが正常に作られる', () => {
    const { schemeError } = createHttpError()
    const error = schemeError()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(5000)
    expect(error.message).toBe('スキームが間違っています。')
  })

  it('createHttpErrorのparseErrorが正常に作られる', () => {
    const { parseError } = createHttpError()
    const error = parseError()

    expect(error).toBeInstanceOf(HttpError)
    expect(error.type).toBe('httpError')
    expect(error.status).toBe(8888)
    expect(error.message).toBe('パースエラーです')
  })
})
