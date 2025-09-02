"use client";

import { CardListView } from "@/components/view";
import { useSinglePageCharacters } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { OPTION_SOME } from "@/utils/option";

function SingleDynamicPotter() {
    const { characters, isLoading, error } = useSinglePageCharacters();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error.kind === OPTION_SOME) {
        return <div>Error: {error.value.message}</div>;
    }

    if (characters.length === 0) {
        return <div>No characters.</div>;
    }

    return (
        <CardListView
            potters={characters}
            title={ja.app.singleDynamicPotter.title}
        />
    );
}

export default SingleDynamicPotter;
