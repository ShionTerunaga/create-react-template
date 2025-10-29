import { CustomError } from "../core/core-error";

export interface InvokeError extends CustomError {
    type: "invokeError";
}

export function invokeError(message: string): InvokeError {
    return {
        type: "invokeError",
        message
    };
}
