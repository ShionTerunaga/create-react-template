import { Card } from "@/components/layout";
import { GridBox, Heading } from "@/components/ui";
import FontCenter from "@/components/ui/center/font-center/font-center";
import { APIView } from "@/features/harry-potter";
import { ja } from "@/shared/lang/ja";
import { CheckerProps } from "@/shared/types/object";

interface Props {
    potters: Array<APIView>;
}

export function CardListView<T extends Props>(
    props: CheckerProps<T, Props, "Cache potter layout has not any props.">
) {
    const { potters } = props;

    return (
        <section>
            <FontCenter>
                <Heading>{ja.app.cachePotter.title}</Heading>
            </FontCenter>

            <GridBox>
                {potters.map(({ id, image, name }) => (
                    <Card
                        key={id}
                        src={image}
                        alt={id}
                        title={name}
                        srcWidth={150}
                        boxHeight={300}
                        srcHeight={200}
                    />
                ))}
            </GridBox>
        </section>
    );
}
