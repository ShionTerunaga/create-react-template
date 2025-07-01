import { appConfig } from "@/shared/config/config";
import { OPTION_NONE } from "@/utils/option";
import { APIScheme } from "../model/model-view";
import { perseApi } from "../utils/parse-api";

export async function getCharacter() {
    const url = appConfig.apiKey;

    if (url.kind === OPTION_NONE) {
        throw new Error("APIキーを設定してください");
    }

    const res = await fetch(url.value);

    //ここでstatusハンドリング

    const resValue = await res.json();

    const judgeType = APIScheme.safeParse(resValue);

    if (judgeType.error) {
        throw new Error("スキームを確認してください");
    }

    const okValue = judgeType.data;

    const perseCharacter = perseApi(okValue);

    return perseCharacter;
}
