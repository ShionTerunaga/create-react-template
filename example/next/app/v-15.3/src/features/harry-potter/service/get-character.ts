import { appConfig } from "@/shared/config/config";
import { Option, OPTION_NONE } from "@/utils/option";
import { APIScheme } from "../model/model-res";
import { perseApi } from "../utils/parse-api";
import { createResult, Result } from "@/utils/result";
import { APIView } from "../model/model-view";
import { HttpError } from "@/utils/error/http";
import { isHttpStatus } from "@/utils/error/is-http-status";

export async function getCharacter(): Promise<
    Result<Array<APIView>, HttpError>
> {
    const url: Option<string> = appConfig.apiKey;

    if (url.kind === OPTION_NONE) {
        return createResult.ng(
            new HttpError({
                status: 404,
                message: "パスを設定してください"
            })
        );
    }

    const res = await fetch(url.value);

    if (!res.ok) {
        const status = res.status;

        if (!isHttpStatus(status)) {
            return createResult.ng(
                new HttpError({
                    status: 501,
                    message: "ステータスコードの定義が間違えています"
                })
            );
        }

        //あとで作ろうかな
        return createResult.ng(
            new HttpError({
                status,
                message: "httpエラーです"
            })
        );
    }

    const resValue = await res.json();

    const judgeType = APIScheme.safeParse(resValue);

    if (judgeType.error) {
        return createResult.ng(
            new HttpError({
                status: 500,
                message: "スキームが間違っています。"
            })
        );
    }

    const okValue = judgeType.data;

    const perseCharacter = perseApi(okValue);

    return createResult.ok(perseCharacter);
}
