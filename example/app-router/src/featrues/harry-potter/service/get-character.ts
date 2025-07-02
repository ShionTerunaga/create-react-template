import { appConfig } from "@/shared/config/config";
import { OPTION_NONE } from "@/utils/option";
import { APIScheme } from "../model/model-view";
import { perseApi } from "../utils/parse-api";
import { createResult, Result } from "@/utils/result";
import { APIView } from "../model/model-res";
import { HttpError } from "@/utils/error/http";

export async function getCharacter(): Promise<
    Result<Array<APIView>, HttpError>
> {
    const url = appConfig.apiKey;

    if (url.kind === OPTION_NONE) {
        return createResult.ng(
            new HttpError({
                status: 404,
                message: "パスを設定してください"
            })
        );
    }

    const res = await fetch(url.value);

    //ここでstatusハンドリング

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
