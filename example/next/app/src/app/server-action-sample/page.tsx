import { ja } from "@/shared/lang/ja";
import RandomStart from "./_components/random-start/random-start";
import { Heading } from "@/components/ui";

function ServerActionSample() {
    return (
        <main>
            <Heading as="h1">{ja.app.serverActionSample.title}</Heading>

            <RandomStart />
        </main>
    );
}

export default ServerActionSample;
