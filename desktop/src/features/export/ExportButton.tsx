import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export function ExportButton() {
    async function handleExport(platform: "mac" | "win") {
        const selected = await open({ directory: true });

        console.log("hoge");

        if (!selected) return;
        // selected can be string or string[] depending on options
        const dest = Array.isArray(selected) ? selected[0] : selected;
        try {
            const res = await invoke("zip_export", {
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
            <button onClick={() => handleExport("mac")}>Export mac ZIP</button>
            <button onClick={() => handleExport("win")}>Export win ZIP</button>
        </div>
    );
}
