import { appConfig } from "@/shared/config/config";
import { Option, OPTION_NONE } from "@/utils/option";
import { APIScheme } from "../model/model-res";
import { perseApi } from "./parse-api";
import { createResult, Result } from "@/utils/result";
import { APIView } from "../model/model-view";
import { createHttpError, HttpError } from "@/utils/error/http";
import { createHttpScheme } from "@/utils/error/http-scheme";

export async function getCharacter(
    cache?: RequestCache
): Promise<Result<Array<APIView>, HttpError>> {
    const httpErrorScheme = createHttpScheme();
    const createError = createHttpError();

    const url: Option<string> = appConfig.apiKey;

    if (url.kind === OPTION_NONE) {
        return createResult.ng(createError.notFoundAPIUrl());
    }

    const res = await fetch(url.value, {
        cache
    });

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

    const judgeType = APIScheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createResult.ng(createError.schemeError());
    }

    const okValue = judgeType.data;

    const perseCharacter = perseApi(okValue);

    return createResult.ok(perseCharacter);
}
