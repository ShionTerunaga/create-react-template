import { appConfig } from "@/shared/config/config";
import { HttpError, isHttpStatus } from "@/utils/error/http";
import { OPTION_NONE } from "@/utils/option";
import { createResult, Result } from "@/utils/result";
import { RandomDogRes, randomDogScheme } from "../model/random-dog";

import { parseScheme } from "./parce-scheme";

export async function getRandomDog(): Promise<Result<RandomDogRes, HttpError>> {
    const apiURL = appConfig.apiKey2;

    if (apiURL.kind === OPTION_NONE) {
        return createResult.ng(
            new HttpError({
                status: 4040,
                message: "APIのURLが設定されていません"
            })
        );
    }

    const res = await fetch(apiURL.value);

    if (!res.ok) {
        const status = res.status;

        if (!isHttpStatus(status)) {
            return createResult.ng(
                new HttpError({
                    status: 5010,
                    message: "ステータスコードの定義が間違えています"
                })
            );
        }
        return createResult.ng(
            new HttpError({
                status: 5000, //仮で5000にしてます
                message: "httpエラーです"
            })
        );
    }

    const resValue = await res.json();

    const judgeType = randomDogScheme.safeParse(resValue);

    if (judgeType.error !== undefined) {
        return createResult.ng(
            new HttpError({
                status: 5000, //仮で5000にしてます
                message: "スキームが間違っています。"
            })
        );
    }

    return parseScheme(judgeType.data);
}
