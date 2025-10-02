import { createHttpScheme, HttpStatus } from "./http-scheme";

export function isHttpStatus(status: unknown): status is HttpStatus {
    const httpErrorScheme = createHttpScheme();

    if (typeof status !== "number") {
        return false;
    }

    return Object.values(httpErrorScheme.httpErrorStatusResponse).includes(
        status
    );
}
