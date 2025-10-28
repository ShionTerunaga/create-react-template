import { CustomError } from "../core/core-error";

export interface SaveError extends CustomError {
    type: "saveError";
}

export function saveError(message: string): SaveError {
    return {
        type: "saveError",
        message
    };
}
