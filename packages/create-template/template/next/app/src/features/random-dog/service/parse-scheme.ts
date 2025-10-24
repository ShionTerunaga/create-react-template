import { resultUtility, Result } from "@/utils/result";
import { RandomDogRes } from "../model/random-dog";
import { createHttpError, HttpError } from "@/utils/error/http/http";
import { Option, optionUtility } from "@/utils/option";

export function parseScheme(
    scheme: RandomDogRes
): Result<Option<RandomDogRes>, HttpError> {
    const createError = createHttpError;
    const { createOk, createNg } = resultUtility;
    const { createSome } = optionUtility;

    if (scheme.status !== "success") {
        return createNg(createError.parseError());
    }

    return createOk(createSome(scheme));
}
