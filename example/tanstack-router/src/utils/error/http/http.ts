import {
  createHttpScheme,
  type HttpCustomStatus,
} from '@/utils/error/http/http-scheme'

export class HttpError extends Error {
  public type: string
  public status: HttpCustomStatus
  public message: string

  constructor({
    status,
    message,
  }: {
    status: HttpCustomStatus
    message: string
  }) {
    super(message)

    this.type = 'httpError'
    this.status = status
    this.message = message
  }
}

/**ここは仕様に応じて変更する*/
export const createHttpError = (function () {
  const httpErrorScheme = createHttpScheme

  const notFoundAPIUrl = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.notFoundAPIUrl,
      message: httpErrorScheme.errorMessage.notFoundAPIUrl,
    })
  }

  const returnNotFoundAPIUrl = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.returnNotFoundAPIUrl,
      message: httpErrorScheme.errorMessage.returnNotFoundAPIUrl,
    })
  }

  const returnNoPermission = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.returnNoPermission,
      message: httpErrorScheme.errorMessage.returnNoPermission,
    })
  }

  const returnBadRequest = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.returnBadRequest,
      message: httpErrorScheme.errorMessage.returnBadRequest,
    })
  }

  const returnInternalServerError = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.serverError,
      message: httpErrorScheme.errorMessage.serverError,
    })
  }

  const unknownError = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.unknownError,
      message: httpErrorScheme.errorMessage.unknownError,
    })
  }

  const schemeError = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.schemeError,
      message: httpErrorScheme.errorMessage.schemeError,
    })
  }

  const parseError = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.parseError,
      message: httpErrorScheme.errorMessage.parseError,
    })
  }

  const responseError = () => {
    return new HttpError({
      status: httpErrorScheme.httpCustomStatusScheme.responseError,
      message: httpErrorScheme.errorMessage.responseError,
    })
  }

  return {
    notFoundAPIUrl,
    unknownError,
    schemeError,
    returnNotFoundAPIUrl,
    returnNoPermission,
    returnBadRequest,
    returnInternalServerError,
    parseError,
    responseError,
  }
})()
