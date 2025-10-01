/**
 * 適宜必要なステータスを追加する
 */
export type HttpStatus = 404 | 500 | 403 | 400 | 501;

export type HttpCustomStatus =
    | 4040 //URLが設定されていない
    | 4041 //httpからのレスポンスで404が返ってきた
    | 4030 //権限がない
    | 4000 //不正なリクエスト
    | 5000 //
    | 5001
    | 5010
    | 9999;

export class HttpError extends Error {
    public type: string;
    public status: HttpCustomStatus;
    public message: string;

    constructor({
        status,
        message
    }: {
        status: HttpCustomStatus;
        message: string;
    }) {
        super(message);

        this.type = "httpError";
        this.status = status;
        this.message = message;
    }
}

export function isHttpStatus(status: unknown): status is HttpStatus {
    if (typeof status === "number") {
        return false;
    }

    return status === 404 || status === 500 || status === 501;
}

export function createHttpError() {
    const notFoundAPIUrl = () => {
        return new HttpError({
            status: 4040,
            message: "APIのURLが設定されていません"
        });
    };

    const returnNotFoundAPIUrl = () => {
        return new HttpError({
            status: 4041,
            message: "APIのURLが見つかりません"
        });
    };

    const returnDifferentMethod = () => {
        return new HttpError({
            status: 4030,
            message: "権限がありません"
        });
    };

    const returnBadRequest = () => {
        return new HttpError({
            status: 4000,
            message: "不正なリクエストです"
        });
    };

    const unknownError = () => {
        return new HttpError({
            status: 9999,
            message: "unknown error"
        });
    };

    const schemeError = () => {
        return new HttpError({
            status: 5000,
            message: "スキームが間違っています。"
        });
    };

    const customError = (message: string) => {
        return new HttpError({
            status: 5001,
            message
        });
    };

    return {
        notFoundAPIUrl,
        unknownError,
        schemeError,
        customError,
        returnNotFoundAPIUrl,
        returnDifferentMethod,
        returnBadRequest
    };
}
