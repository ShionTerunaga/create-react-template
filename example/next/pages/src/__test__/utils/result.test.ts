import { resultUtility } from "@/utils/result";
import { describe, expect, it } from "vitest";

describe("resultUtility", () => {
    const { createNg, createOk } = resultUtility;

    it("resultがokだったらvalueに値が入っている", () => {
        const result = "test";
        const okResult = createOk(result);

        if (okResult.kind === "ng") {
            throw new Error("ng");
        }

        expect(okResult.kind).toEqual("ok");
        expect(okResult.value).toEqual(result);
    });

    it("resultがngだったらerrに値が入っている", () => {
        const result = "error";
        const ngResult = createNg(result);

        if (ngResult.kind === "ok") {
            throw new Error("ok");
        }

        expect(ngResult.kind).toEqual("ng");
        expect(ngResult.err).toEqual(result);
    });
});
