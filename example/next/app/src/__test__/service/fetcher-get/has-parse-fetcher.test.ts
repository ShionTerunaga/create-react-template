import { hasParseFetcher } from "@/service/fetcher-get/has-parse-fetcher";
import { z } from "zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOption } from "@/utils/option";
import { createResult } from "@/utils/result";

const mockFetch = vi.fn();

describe("hasParseFetcher", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("fetch", mockFetch);
    });

    it("propagates ng from fetcher", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({})
        });

        const schema = z.object({});

        const result = await hasParseFetcher({
            url: createOption.some("https://example.com"),
            scheme: schema,
            parse: () => createResult.ok("ok")
        });

        expect(result.kind).toBe("ng");
    });

    it("returns parse result when fetcher ok", async () => {
        const payload = { a: 1 };
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => payload
        });

        const schema = z.object({ a: z.number() });

        const result = await hasParseFetcher({
            url: createOption.some("https://example.com"),
            scheme: schema,
            parse: () => createResult.ok("parsed")
        });

        expect(result.kind).toBe("ok");
        if (result.kind === "ok") expect(result.value).toBe("parsed");
    });
});
