/**
 * 適宜必要なステータスを追加する
 */
export type HttpStatus = 404 | 500 | 501

export class HttpError extends Error {
  public type: string
  public status: HttpStatus
  public message: string

  constructor({ status, message }: { status: HttpStatus; message: string }) {
    super(message)

    this.type = 'httpError'
    this.status = status
    this.message = message
  }
}
