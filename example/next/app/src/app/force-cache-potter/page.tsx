import { Box } from "@/components/ui";
import { CardListView } from "@/components/view";
import { getCharacter } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { RESULT_NG } from "@/utils/result";

async function ForceCachePotter() {
    const potters = await getCharacter("force-cache");

    if (potters.kind === RESULT_NG) {
        return <Box>error</Box>;
    }

    return (
        <CardListView
            potters={potters.value}
            title={ja.app.forceCachePotter.title}
        />
    );
}

export default ForceCachePotter;
