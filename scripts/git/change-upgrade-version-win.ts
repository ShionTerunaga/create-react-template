import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { homedir } from "node:os";

// === 設定 ===
const ZIP_URL =
    "https://github.com/ShionTerunaga/create-react-template/archive/refs/heads/release.zip";
const ZIP_PATH = path.resolve("repo.zip");
const TEMP_DIR = path.resolve("repo");
const EXEC_DIR = path.join(
    TEMP_DIR,
    "create-react-template-release",
    "execution",
    "win"
);

// === 関数群 ===
async function downloadZip(url: string, dest: string) {
    console.log(`📦 Downloading ZIP from ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`✅ Saved to ${dest}`);
}

function extractZip(zipPath: string, extractTo: string) {
    console.log(`🗜️ Extracting ${zipPath} ...`);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractTo, true);
    console.log(`✅ Extracted to ${extractTo}`);
}

function moveContents(srcDir: string, destDir: string) {
    console.log(`📁 Moving files from ${srcDir} to ${destDir}`);
    if (!fs.existsSync(srcDir))
        throw new Error(`Source directory not found: ${srcDir}`);

    const items = fs.readdirSync(srcDir);
    for (const item of items) {
        if (item === "upgrade-tmp.exe") continue;

        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);

        // 既に同名ファイルがある場合、削除してから移動
        if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { force: true, recursive: true });
        }

        fs.renameSync(srcPath, destPath);
    }
    console.log(`✅ Moved all files`);
}

function removeDir(dir: string) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️ Removed: ${dir}`);
    }
}

async function main() {
    try {
        await downloadZip(ZIP_URL, ZIP_PATH);

        // 2. 解凍
        extractZip(ZIP_PATH, TEMP_DIR);

        // 3. exection/win の中身を現在のディレクトリに移動
        moveContents(EXEC_DIR, path.join(homedir(), "tools"));

        // 4. ZIPとTEMP削除
        removeDir(TEMP_DIR);
        removeDir(ZIP_PATH);

        console.log("🎉 Done!");
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

main();