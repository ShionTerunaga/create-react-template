import { createHttpError, HttpError } from "@/utils/error/http";
import { describe, expect, it } from "vitest";

describe("httpError", () => {
    it("httpErrorクラスが正常に作られる", () => {
        const error = new HttpError({
            status: 4000,
            message: "bad request"
        });

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4000);
        expect(error.message).toBe("bad request");
    });

    const {
        notFoundAPIUrl,
        returnNotFoundAPIUrl,
        returnNoPermission,
        returnBadRequest,
        returnInternalServerError,
        unknownError,
        schemeError,
        parseError
    } = createHttpError;

    it("createHttpErrorのnotFoundAPIUrlが正常に作られる", () => {
        const error = notFoundAPIUrl();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4040);
        expect(error.message).toBe("APIのURLが設定されていません");
    });
    it("createHttpErrorのreturnNotFoundAPIUrlが正常に作られる", () => {
        const error = returnNotFoundAPIUrl();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4041);
        expect(error.message).toBe("APIのURLが見つかりません");
    });

    it("createHttpErrorのreturnNoPermissionが正常に作られる", () => {
        const error = returnNoPermission();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4030);
        expect(error.message).toBe("権限がありません");
    });

    it("createHttpErrorのreturnBadRequestが正常に作られる", () => {
        const error = returnBadRequest();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(4000);
        expect(error.message).toBe("不正なリクエストです");
    });

    it("createHttpErrorのreturnInternalServerErrorが正常に作られる", () => {
        const error = returnInternalServerError();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(5001);
        expect(error.message).toBe("サーバーエラーです");
    });

    it("createHttpErrorのunknownErrorが正常に作られる", () => {
        const error = unknownError();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(9999);
        expect(error.message).toBe("unknown error");
    });
    it("createHttpErrorのschemeErrorが正常に作られる", () => {
        const error = schemeError();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(5000);
        expect(error.message).toBe("スキームが間違っています。");
    });

    it("createHttpErrorのparseErrorが正常に作られる", () => {
        const error = parseError();

        expect(error).toBeInstanceOf(HttpError);
        expect(error.type).toBe("httpError");
        expect(error.status).toBe(8888);
        expect(error.message).toBe("パースエラーです");
    });
});
