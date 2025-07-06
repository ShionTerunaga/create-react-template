import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createOption } from "@/utils/option";
import { appConfig } from "@/shared/config/config";
import { APIRes, getCharacter } from "@/features/harry-potter";
import { RESULT_NG, RESULT_OK } from "@/utils/result";

const mockAPIData: APIRes = [
    {
        id: "1",
        name: "Harry Potter",
        alternate_names: [],
        species: "human",
        gender: "male",
        house: "Gryffindor",
        dateOfBirth: "31-07-1980",
        yearOfBirth: 1980,
        wizard: true,
        ancestry: "half-blood",
        eyeColour: "green",
        hairColour: "black",
        wand: {
            wood: "holly",
            core: "phoenix feather",
            length: 11
        },
        patronus: "stag",
        hogwartsStudent: true,
        hogwartsStaff: false,
        actor: "Daniel Radcliffe",
        alternate_actors: [],
        alive: true,
        image: "https://hp-api/image.jpg"
    }
];

// ✅ 2. fetchモックのセットアップ
global.fetch = vi.fn();

const mockFetch = fetch as Mock;

describe("getCharacter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("APIのURLを設定していない場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createOption.none()
        );

        const result = await getCharacter();

        expect(result.kind).toBe(RESULT_NG);

        if (result.kind === RESULT_OK) return;

        expect(result.err.status).toBe(404);
        expect(result.err.message).toBe("パスを設定してください");
    });

    it("レスポンスがerrorの場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createOption.some("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 500, //statusコードは存在するものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getCharacter();

        expect(result.kind).toBe(RESULT_NG);

        if (result.kind === RESULT_OK) return;

        expect(result.err.status).toBe(501);
        expect(result.err.message).toBe(
            "ステータスコードの定義が間違えています"
        );
    });

    it("レスポンスがerrorでstatusコードが設定していないものが来た場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createOption.some("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: false,
            status: 300, //statusコードは存在するものを定義する
            json: async () => ({
                message: "mock error"
            })
        });

        const result = await getCharacter();

        expect(result.kind).toBe(RESULT_NG);

        if (result.kind === RESULT_OK) return;

        expect(result.err.status).toBe(501);
        expect(result.err.message).toBe(
            "ステータスコードの定義が間違えています"
        );
    });

    it("スキームが合わない場合", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createOption.some("https://mock-api.com/characters")
        );

        // 👇 Schema に合わないデータ（例えば wand が null）
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => [{ ...mockAPIData[0], wand: null }]
        });

        const result = await getCharacter();

        expect(result.kind).toBe(RESULT_NG);

        if (result.kind === RESULT_OK) return;

        expect(result.err.status).toBe(500);
        expect(result.err.message).toContain("スキームが間違っています");
    });

    it("should return parsed characters when valid data is provided", async () => {
        vi.spyOn(appConfig, "apiKey", "get").mockReturnValue(
            createOption.some("https://mock-api.com/characters")
        );

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockAPIData
        });

        const result = await getCharacter();

        expect(result.kind).toBe(RESULT_OK);

        if (result.kind === RESULT_NG) return;

        expect(result.value.length).toBe(1);
        expect(result.value[0].name).toBe("Harry Potter");
    });
});
