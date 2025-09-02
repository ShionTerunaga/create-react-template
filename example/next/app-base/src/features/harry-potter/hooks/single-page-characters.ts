"use client";

import { useEffect, useMemo, useState } from "react";
import { SinglePageGetCharacters } from "./characters.type";
import { createOption, Option, OPTION_NONE } from "@/utils/option";
import { getCharacter } from "../service/get-character";
import { RESULT_NG } from "@/utils/result";
import { APIView } from "../model/model-view";
import { HttpError } from "@/utils/error/http";

export function useSinglePageCharacters() {
    const [fetchCharacter, setFetchCharacter] = useState<
        Option<Array<APIView>>
    >(createOption.none());

    const [error, setError] = useState<Option<HttpError>>(createOption.none());

    useEffect(() => {
        let isMounted = true;

        (async () => {
            const result = await getCharacter();

            if (!isMounted) return;

            if (result.kind === RESULT_NG) {
                setError(createOption.some(result.err));
                return;
            }

            setFetchCharacter(createOption.some(result.value));
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    const isLoading: boolean = useMemo(() => {
        return (
            fetchCharacter.kind === OPTION_NONE && error.kind === OPTION_NONE
        );
    }, [fetchCharacter, error]);

    const characters: Array<SinglePageGetCharacters> = useMemo(() => {
        if (fetchCharacter.kind === OPTION_NONE) {
            return [];
        }

        const characters: Array<SinglePageGetCharacters> =
            fetchCharacter.value.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image
            }));

        return characters;
    }, [fetchCharacter]);

    return {
        isLoading,
        characters,
        error
    };
}
