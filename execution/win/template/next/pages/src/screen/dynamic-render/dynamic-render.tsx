import { CardListView } from "@/components/view";
import { useSinglePageCharacters } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { OPTION_SOME } from "@/utils/option";

function DynamicScreen() {
    const { isLoading, error, characters } = useSinglePageCharacters();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error.kind === OPTION_SOME) {
        return <div>動的取得が失敗してます。</div>;
    }

    return (
        <CardListView
            potters={characters}
            title={ja.app.serverSideRenderPotter.title}
        />
    );
}

export default DynamicScreen;
