import { createResult, Result } from "@/utils/result";
import { RandomDogRes } from "../model/random-dog";
import { createHttpError, HttpError } from "@/utils/error/http";

export function parseScheme(
    scheme: RandomDogRes
): Result<RandomDogRes, HttpError> {
    const createError = createHttpError();

    if (scheme.status !== "success") {
        return createResult.ng(createError.parseError());
    }

    return createResult.ok(scheme);
}
