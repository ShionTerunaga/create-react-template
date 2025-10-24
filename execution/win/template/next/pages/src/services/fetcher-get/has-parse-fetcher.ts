import { core, ZodType } from "zod";
import { Option, optionUtility } from "@/utils/option";
import { HttpError } from "@/utils/error/http";
import { resultUtility, Result } from "@/utils/result";
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
    parse: (scheme: core.output<T>) => Result<Option<S>, HttpError>;
}): Promise<Result<Option<S>, HttpError>> {
    const { isNG, createOk } = resultUtility;
    const { createNone, isNone } = optionUtility;

    const fetcherResult = await fetcher<T>({
        url,
        scheme,
        cache
    });

    if (isNG(fetcherResult)) {
        return fetcherResult;
    }

    if (isNone(fetcherResult.value)) {
        return createOk(createNone());
    }

    return parse(fetcherResult.value.value);
}
