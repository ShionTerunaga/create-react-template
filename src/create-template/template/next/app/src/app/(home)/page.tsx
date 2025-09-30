import { Heading } from "@/components/ui";
import { ja } from "@/shared/lang/ja";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Heading>{ja.app.home.title}</Heading>

            <div>
                <Link href="/force-cache-potter">
                    {ja.app.home.toForceCachePotter}
                </Link>
                <br />
                <Link href="/no-store-potter">
                    {ja.app.home.toNoStorePotter}
                </Link>
            </div>
        </main>
    );
}
