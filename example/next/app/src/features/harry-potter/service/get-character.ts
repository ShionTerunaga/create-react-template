import { appConfig } from "@/shared/config/config";
import { Option, OPTION_NONE } from "@/utils/option";
import { APIScheme } from "../model/model-res";
import { perseApi } from "../utils/parse-api";
import { createResult, Result } from "@/utils/result";
import { APIView } from "../model/model-view";
import { createHttpError, HttpError, isHttpStatus } from "@/utils/error/http";

export async function getCharacter(
    cache?: RequestCache
): Promise<Result<Array<APIView>, HttpError>> {
    const url: Option<string> = appConfig.apiKey;

    if (url.kind === OPTION_NONE) {
        return createResult.ng(createHttpError().notFoundAPIUrl());
    }

    const res = await fetch(url.value, {
        cache
    });

    if (!res.ok) {
        const status = res.status;

        if (!isHttpStatus(status)) {
            return createResult.ng(createHttpError().unknownError());
        }

        //あとで作ろうかな
        return createResult.ng(
            new HttpError({
                status: 5000, //仮で5000にしてます
                message: "httpエラーです"
            })
        );
    }

    const resValue = await res.json();

    const judgeType = APIScheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createResult.ng(createHttpError().schemeError());
    }

    const okValue = judgeType.data;

    const perseCharacter = perseApi(okValue);

    return createResult.ok(perseCharacter);
}
