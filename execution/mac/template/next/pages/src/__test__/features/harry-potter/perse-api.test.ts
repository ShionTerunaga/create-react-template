import { describe, it, expect } from "vitest";

import { createOption } from "@/utils/option";
import { APIRes } from "@/features/harry-potter";
import { perseApi } from "@/features/harry-potter/service/parse-api";

const mockApiData: APIRes = [
    {
        id: "1",
        name: "Harry Potter",
        alternate_names: ["The Boy Who Lived"],
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
    },
    {
        id: "2",
        name: "Unknown Ghost",
        alternate_names: [],
        species: "ghost",
        gender: "",
        house: "",
        dateOfBirth: null,
        yearOfBirth: null,
        wizard: false,
        ancestry: "",
        eyeColour: "",
        hairColour: "",
        wand: {
            wood: "",
            core: "",
            length: null
        },
        patronus: "",
        hogwartsStudent: false,
        hogwartsStaff: false,
        actor: "",
        alternate_actors: [],
        alive: false,
        image: ""
    }
];

describe("perseApi", () => {
    it("適したフォーマットが返ってくる", () => {
        const result = perseApi(mockApiData);

        expect(result.length).toBe(1);

        const harry = result[0];
        expect(harry.name).toBe("Harry Potter");
        expect(harry.alternateNames).toEqual(["The Boy Who Lived"]);
        expect(harry.gender).toBe("male");
        expect(harry.dateOfBirth).toEqual(createOption.some("31-07-1980"));
        expect(harry.yearOfBirth).toEqual(createOption.some(1980));
        expect(harry.wand.length).toEqual(createOption.some(11));
    });

    it("nullをOptionに変換できているか", () => {
        const dataWithNulls: APIRes = [
            {
                ...mockApiData[0],
                dateOfBirth: null,
                yearOfBirth: null,
                wand: {
                    ...mockApiData[0].wand,
                    length: null
                },
                image: "https://someimage.jpg"
            }
        ];

        const result = perseApi(dataWithNulls);
        const character = result[0];

        expect(character.dateOfBirth).toEqual(createOption.none());
        expect(character.yearOfBirth).toEqual(createOption.none());
        expect(character.wand.length).toEqual(createOption.none());
    });

    it("imageが空文字の時は要素が省かれる", () => {
        const dataWithNoImages: APIRes = mockApiData.map((item) => ({
            ...item,
            image: ""
        }));

        const result = perseApi(dataWithNoImages);
        expect(result).toEqual([]);
    });
});
