import { useState } from "react";
import { Option, optionUtility } from "../utils/option";
import { resultUtility } from "../utils/result";
import { tryInvokeHasParams } from "../utils/tauri/try-invoke";
import { useLoading } from "../features/loading";

type Platform = "win" | "mac";

export function CliDownloadsPage() {
    const { createNone, createSome, isNone } = optionUtility;
    const { isNG } = resultUtility;
    const { openLoading, closeLoading } = useLoading();

    const [result, setResult] = useState<Option<string>>(createNone());

    async function handleExport(platform: Platform) {
        setResult(createNone());
        openLoading();

        const res = await tryInvokeHasParams({
            command: "download_cli",
            args: {
                platform: platform
            }
        });

        if (isNG(res)) {
            setResult(createSome(res.err.message));
            closeLoading();

            return;
        }

        setResult(createSome("exported to " + String(res.value)));

        closeLoading();
    }

    return (
        <section>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleExport("mac")}>
                    Export mac ZIP
                </button>
                <button onClick={() => handleExport("win")}>
                    Export win ZIP
                </button>
            </div>

            {!isNone(result) && <div>{result.value}</div>}
        </section>
    );
}
