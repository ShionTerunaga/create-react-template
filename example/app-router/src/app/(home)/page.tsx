import { Heading } from "@/components/ui";
import { ja } from "@/shared/lang/ja";

export default function Home() {
    return (
        <div>
            <Heading>{ja.app.home.title}</Heading>
        </div>
    );
}
