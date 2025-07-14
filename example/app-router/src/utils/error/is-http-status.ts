import { HttpStatus } from "./http";

export function isHttpStatus(status: unknown): status is HttpStatus {
    if (typeof status === "number") {
        return false;
    }

    return status === 404 || status === 500 || status === 501;
}
