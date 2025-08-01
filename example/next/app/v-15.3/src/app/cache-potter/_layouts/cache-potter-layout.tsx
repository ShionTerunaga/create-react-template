import { APIView } from "@/features/harry-potter";
import { CheckerProps } from "@/shared/types/object";

interface Props {
    potters: Array<APIView>;
}

function CachePotterLayout<T extends Props>(
    props: CheckerProps<T, Props, "Cache potter layout has not any props.">
) {
    const { potters } = props;

    return <section></section>;
}

export default CachePotterLayout;
