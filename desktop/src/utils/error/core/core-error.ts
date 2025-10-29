export type ErrorType =
    | "httpError"
    | "objectError"
    | "invokeError"
    | "saveError";

export interface CustomError {
    type: ErrorType;
    message: string;
}
