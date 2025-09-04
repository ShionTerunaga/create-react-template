import { Heading } from "@/components/ui";
import { ja } from "@/shared/lang/ja";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Heading>{ja.app.home.title}</Heading>

            <div>
                <Link href="/cache-potter">{ja.app.home.toCachePotter}</Link>
                <br />
                <Link href="/single-dynamic-potter">
                    {ja.app.home.toSingleDynamicPotter}
                </Link>
            </div>
        </main>
    );
}
