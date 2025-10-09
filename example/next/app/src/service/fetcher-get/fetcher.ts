import { core, ZodType } from "zod";
import { Option, OPTION_NONE } from "../../utils/option";
import { createResult, Result } from "../../utils/result";
import { createHttpError, HttpError } from "../../utils/error/http";
import { createHttpScheme } from "../../utils/error/http-scheme";

export async function fetcher<T extends ZodType>({
    url,
    scheme,
    cache
}: {
    url: Option<string>;
    scheme: T;
    cache?: RequestCache;
}): Promise<Result<core.output<T>, HttpError>> {
    const httpErrorScheme = createHttpScheme();
    const createError = createHttpError();

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

    const judgeType = scheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createResult.ng(createError.schemeError());
    }

    const okValue = judgeType.data;

    if (okValue === undefined || okValue === null) {
        return createResult.ng(createError.responseError());
    }

    return createResult.ok(okValue);
}
