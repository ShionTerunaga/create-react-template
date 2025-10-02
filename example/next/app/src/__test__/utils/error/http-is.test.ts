import { isHttpStatus } from "@/utils/error/http-is";
import { describe, expect, it } from "vitest";

describe("http-is", () => {
    it("isHttpStatusにおいて500を送るとtrueで返ってくる", () => {
        const judge = isHttpStatus(500);
        expect(judge).toBeTruthy();
    });

    it("isHttpStatusにおいて404を送るとtrueで返ってくる", () => {
        const judge = isHttpStatus(404);
        expect(judge).toBeTruthy();
    });

    it("isHttpStatusにおいて403を送るとtrueで返ってくる", () => {
        const judge = isHttpStatus(403);
        expect(judge).toBeTruthy();
    });

    it("isHttpStatusにおいて400を送るとtrueで返ってくる", () => {
        const judge = isHttpStatus(400);
        expect(judge).toBeTruthy();
    });

    it("isHttpStatusにおいて9999を送るとfalseで返ってくる", () => {
        const judge = isHttpStatus(9999);
        expect(judge).toBeFalsy();
    });

    it("isHttpStatusにおいて文字列を送るとfalseで返ってくる", () => {
        const judge = isHttpStatus("500");
        expect(judge).toBeFalsy();
    });

    it("isHttpStatusにおいてnullを送るとfalseで返ってくる", () => {
        const judge = isHttpStatus(null);
        expect(judge).toBeFalsy();
    });

    it("isHttpStatusにおいてundefinedを送るとfalseで返ってくる", () => {
        const judge = isHttpStatus(undefined);
        expect(judge).toBeFalsy();
    });
});
