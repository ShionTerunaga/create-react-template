import { core, ZodType } from "zod";
import { Option } from "../../utils/option";
import { createHttpError, HttpError } from "../../utils/error/http";
import { createResult, Result, RESULT_NG } from "../../utils/result";
import { fetcher } from "./fetcher";

export async function hasParseFetcher<T extends ZodType, S>({
    url,
    scheme,
    cache,
    parse
}: {
    url: Option<string>;
    scheme: T;
    cache?: RequestCache;
    parse: (scheme: core.output<T>) => Result<S, HttpError>;
}): Promise<Result<S, HttpError>> {
    const createError = createHttpError();

    const fetcherResult = await fetcher<T>({
        url,
        scheme,
        cache
    });

    if (fetcherResult.kind === RESULT_NG) {
        return fetcherResult;
    }

    return parse(fetcherResult.value);
}
