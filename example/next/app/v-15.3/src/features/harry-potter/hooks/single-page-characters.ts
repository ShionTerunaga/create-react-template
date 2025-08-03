"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SinglePageGetCharacters } from "./characters.type";
import { createOption, Option, OPTION_NONE } from "@/utils/option";
import { getCharacter } from "../service/get-character";
import { Result, RESULT_NG } from "@/utils/result";
import { APIView } from "../model/model-view";
import { HttpError } from "@/utils/error/http";

export function useSinglePageCharacters() {
    const [fetchCharacter, setFetchCharacter] = useState<
        Option<Array<APIView>>
    >(createOption.none());

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<Option<HttpError>>(createOption.none());

    const fetchProcessing = useCallback(async (): Promise<
        Result<APIView[], HttpError>
    > => {
        const characters = await getCharacter();

        return characters;
    }, []);

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);

        fetchProcessing()
            .then((result) => {
                if (!isMounted) return;

                if (result.kind === RESULT_NG) {
                    setError(createOption.some(result.err));

                    return;
                }

                setFetchCharacter(createOption.some(result.value));
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [fetchProcessing]);

    const characters: Option<Array<SinglePageGetCharacters>> = useMemo(() => {
        if (fetchCharacter.kind === OPTION_NONE) {
            return createOption.none();
        }

        const characters: Array<SinglePageGetCharacters> =
            fetchCharacter.value.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    image: item.image
                };
            });

        return createOption.some(characters);
    }, [fetchCharacter]);

    return {
        characters,
        isLoading,
        error
    };
}
