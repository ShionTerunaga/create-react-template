export type ErrorType = 'httpError' | 'objectError' | 'customError'

export class CustomError extends Error {
  public type: ErrorType
  public message: string

  constructor({
    message,
    type,
  }: {
    message: string
    type: ErrorType
    name: string
  }) {
    super(message)
    this.type = type
    this.message = message
  }
}
