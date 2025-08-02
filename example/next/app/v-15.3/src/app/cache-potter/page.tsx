import { getCharacter } from "@/features/harry-potter";
import { RESULT_NG } from "@/utils/result";
import CachePotterLayout from "./_layouts/cache-potter-layout";

async function CachePotter() {
    const potters = await getCharacter();

    if (potters.kind === RESULT_NG) {
        return <div>error</div>;
    }

    return <CachePotterLayout potters={potters.value} />;
}

export default CachePotter;
