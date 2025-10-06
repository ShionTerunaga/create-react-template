"use server";

import { appConfig } from "@/shared/config/config";
import { createHttpError, HttpError } from "@/utils/error/http";
import { OPTION_NONE } from "@/utils/option";
import { createResult, Result } from "@/utils/result";
import { RandomDogRes, randomDogScheme } from "../model/random-dog";
import { parseScheme } from "./parse-scheme";
import { createHttpScheme } from "@/utils/error/http-scheme";

export async function getRandomDog(): Promise<Result<RandomDogRes, HttpError>> {
    const httpErrorScheme = createHttpScheme();
    const createError = createHttpError();

    const apiURL = appConfig.apiKey2;

    if (apiURL.kind === OPTION_NONE) {
        return createResult.ng(createError.notFoundAPIUrl());
    }

    const res = await fetch(apiURL.value);

    if (!res.ok) {
        const status = res.status;

        switch (status) {
            case httpErrorScheme.httpErrorStatusResponse.notFound:
                return createResult.ng(createError.returnNotFoundAPIUrl());
            case httpErrorScheme.httpErrorStatusResponse.forbidden:
                return createResult.ng(createError.returnNoPermission());
            case httpErrorScheme.httpErrorStatusResponse.badRequest:
                return createResult.ng(createError.returnBadRequest());
            case httpErrorScheme.httpErrorStatusResponse.internalServerError:
                return createResult.ng(createError.returnInternalServerError());
            default:
                return createResult.ng(createError.unknownError());
        }
    }

    const resValue = await res.json();

    const judgeType = randomDogScheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createResult.ng(createError.schemeError());
    }

    return parseScheme(judgeType.data);
}
