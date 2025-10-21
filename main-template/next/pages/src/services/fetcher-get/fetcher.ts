import { core, ZodType } from "zod";
import { Option, optionUtility } from "@/utils/option";
import { Result, resultUtility } from "@/utils/result";
import httpError, { HttpError } from "@/utils/error/http";
import error from "@/utils/error/http";

export async function fetcher<T extends ZodType>({
    url,
    scheme,
    cache
}: {
    url: Option<string>;
    scheme: T;
    cache?: RequestCache;
}): Promise<Result<core.output<T>, HttpError>> {
    const httpErrorScheme = error.createHttpScheme;
    const createError = httpError.createHttpError;

    const { isNone } = optionUtility;
    const { isNG, createNg, createOk, checkPromiseReturn } = resultUtility;

    if (isNone(url)) {
        return createNg(createError.notFoundAPIUrl());
    }

    const res = await checkPromiseReturn({
        fn: () => fetch(url.value, { cache }),
        err: createError.fetchError()
    });

    if (isNG(res)) {
        return res;
    }

    if (!res.value.ok) {
        const status = res.value.status;

        switch (status) {
            case httpErrorScheme.httpErrorStatusResponse.notFound:
                return createNg(createError.returnNotFoundAPIUrl());
            case httpErrorScheme.httpErrorStatusResponse.forbidden:
                return createNg(createError.returnNoPermission());
            case httpErrorScheme.httpErrorStatusResponse.badRequest:
                return createNg(createError.returnBadRequest());
            case httpErrorScheme.httpErrorStatusResponse.internalServerError:
                return createNg(createError.returnInternalServerError());
            default:
                return createNg(createError.unknownError());
        }
    }

    const resValue = await res.value.json();

    const judgeType = scheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createNg(createError.schemeError());
    }

    const okValue = judgeType.data;

    if (okValue === undefined || okValue === null) {
        return createNg(createError.responseError());
    }

    return createOk(okValue);
}
