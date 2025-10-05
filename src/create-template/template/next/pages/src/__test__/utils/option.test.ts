import { createOption, Option } from "@/utils/option";
import { describe, expect, it } from "vitest";

describe("createOption", () => {
    it("someに値を代入したらvalueに値が入っている", () => {
        const someOption: Option<string> = createOption.some("value");

        if (someOption.kind === "none") {
            throw new Error("none");
        }

        expect(someOption.value).toEqual("value");
    });

    it("noneに値を代入したらkindがnoneになる", () => {
        const noneOption: Option<string> = createOption.none();

        expect(noneOption.kind).toEqual("none");
    });
});
