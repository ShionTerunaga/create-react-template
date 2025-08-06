import { CardListView } from "@/components/view";
import { getCharacter } from "@/features/harry-potter";
import { RESULT_NG } from "@/utils/result";

async function CachePotter() {
    const potters = await getCharacter();

    if (potters.kind === RESULT_NG) {
        return <div>error</div>;
    }

    return <CardListView potters={potters.value} />;
}

export default CachePotter;
