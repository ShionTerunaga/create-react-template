import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

type Platform =
    | "win_cli"
    | "mac_cli"
    | "next/app"
    | "next/pages"
    | "tanstack-router";

export function ExportButton() {
    const [message, setMessage] = useState("ready");
    async function handleExport(platform: Platform) {
        try {
            const defaultPath = `${platform.replace(/\//g, "-")}.zip`;
            console.log(`Export finished: ${defaultPath}`);

            const selected = await save({
                defaultPath,
                filters: [{ name: "Zip", extensions: ["zip"] }]
            });
            setMessage("hoge");

            if (!selected) {
                setMessage("cancelled");
                return;
            }

            const dest: string = Array.isArray(selected)
                ? selected[0]
                : selected;
            const res = await invoke("zip_template", {
                src: platform,
                destDir: dest
            });
            console.log("zip created at", res);

            setMessage("exported to " + String(dest));
        } catch (err) {
            alert("Export failed: " + String(err));

            setMessage("export failed " + String(err));
        }
    }

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleExport("mac_cli")}>
                Export mac ZIP
            </button>
            <button onClick={() => handleExport("win_cli")}>
                Export win ZIP
            </button>
            <div>{message}</div>
        </div>
    );
}
