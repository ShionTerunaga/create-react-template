import { useState } from "react";
import { Option, optionUtility } from "../utils/option";
import { trySave } from "../utils/tauri/try-save";
import { resultUtility } from "../utils/result";
import { tryInvokeHasParams } from "../utils/tauri/try-invoke";

type Platform = "win_cli" | "mac_cli";

export function CliDownloadsPage() {
    const { createNone, createSome, isNone } = optionUtility;
    const { isNG } = resultUtility;

    const [result, setResult] = useState<Option<string>>(createNone());

    async function handleExport(platform: Platform) {
        setResult(createNone());

        const defaultPath = `${platform.replace(/\//g, "-")}.zip`;

        const selected = await trySave({
            path: defaultPath,
            filters: [{ name: "Zip", extensions: ["zip"] }]
        });

        if (isNG(selected)) {
            setResult(createSome(selected.err.message));

            return;
        }

        if (isNone(selected.value)) {
            setResult(createSome("cancelled"));

            return;
        }

        const dest: string = Array.isArray(selected.value.value)
            ? selected.value.value[0]
            : selected.value.value;

        const res = await tryInvokeHasParams({
            command: "zip_template",
            args: {
                src: platform,
                destDir: dest
            }
        });

        if (isNG(res)) {
            setResult(createSome(res.err.message));
            return;
        }

        setResult(createSome("exported to " + String(dest)));
    }

    return (
        <section>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleExport("mac_cli")}>
                    Export mac ZIP
                </button>
                <button onClick={() => handleExport("win_cli")}>
                    Export win ZIP
                </button>
            </div>

            {!isNone(result) && <div>{result.value}</div>}
        </section>
    );
}
