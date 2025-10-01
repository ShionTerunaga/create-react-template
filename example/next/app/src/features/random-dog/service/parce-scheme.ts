import { createResult, Result } from "@/utils/result";
import { RandomDogRes } from "../model/random-dog";
import { HttpError } from "@/utils/error/http";

export function parseScheme(
    scheme: RandomDogRes
): Result<RandomDogRes, HttpError> {
    if (scheme.status !== "success") {
        return createResult.ng(
            new HttpError({
                status: 5000, //仮で5000にしてます
                message: "APIのレスポンスが不正です"
            })
        );
    }

    return createResult.ok(scheme);
}
