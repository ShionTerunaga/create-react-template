import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

type Platform =
    | "win_cli"
    | "mac_cli"
    | "next/app"
    | "next/pages"
    | "tanstack-router";

export function ExportButton() {
    async function handleExport(platform: Platform) {
        try {
            const defaultPath = `${platform.replace(/\//g, "-")}.zip`;
            console.log(`Export finished: ${defaultPath}`);

            const selected = await save({
                defaultPath,
                filters: [{ name: "Zip", extensions: ["zip"] }]
            });

            if (!selected) return;

            const dest = Array.isArray(selected) ? selected[0] : selected;
            const res = await invoke("zip_template", {
                platform,
                dest_dir: dest
            });
            console.log("zip created at", res);
            alert(`Export finished: ${res}`);
        } catch (err) {
            console.error(err);
            alert("Export failed: " + String(err));
        }
    }

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => console.log("Export clicked")}>
                Export mac ZIP
            </button>
            <button onClick={() => handleExport("win_cli")}>
                Export win ZIP
            </button>
        </div>
    );
}
