import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import {
    mkdirSync,
    rmSync,
    readdirSync,
    renameSync,
    existsSync,
    statSync
} from "node:fs";
import { join, basename } from "node:path";
import AdmZip from "adm-zip";

// === 設定 ===
const DIR = "tools";
const OWNER = "ShionTerunaga";
const REPO = "create-react-template";
const BRANCH = "release";

export async function main(TARGET_DIR_IN_ZIP: string) {
    const cwd = process.cwd();
    const tmpBase = join(tmpdir(), `upgrade-tmp-${Date.now()}`);
    const zipPath = join(tmpBase, `${REPO}.zip`);
    const extractDir = join(tmpBase, "extract");

    mkdirSync(tmpBase, { recursive: true });
    mkdirSync(extractDir, { recursive: true });

    console.log("📦 Downloading ZIP...");
    const zipUrl = `https://github.com/${OWNER}/${REPO}/archive/refs/heads/${BRANCH}.zip`;
    execSync(`curl -L "${zipUrl}" -o "${zipPath}"`, { stdio: "inherit" });

    console.log("🧩 Extracting...");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractDir, true);

    // 展開後フォルダ（例: create-react-template-release）
    const [rootFolder] = readdirSync(extractDir);
    const extractedRoot = join(extractDir, rootFolder);
    const sourceDir = join(extractedRoot, TARGET_DIR_IN_ZIP);

    if (!existsSync(sourceDir)) {
        throw new Error(`❌ target directory not found in zip: ${sourceDir}`);
    }

    for (const item of readdirSync(DIR)) {
        if (item === basename(__filename)) continue; // 自分自身は消さない
        if (item === ".git") continue;
        const p = join(DIR, item);
        rmSync(p, { recursive: true, force: true });
        console.log("removed:", p);
    }

    console.log("📁 Copying files from:", sourceDir);
    copyRecursive(sourceDir, cwd);

    console.log("🧹 Cleaning temp files...");
    rmSync(tmpBase, { recursive: true, force: true });

    console.log("✅ Upgrade complete!");
}

function copyRecursive(src: string, dest: string) {
    for (const item of readdirSync(src)) {
        const s = join(src, item);
        const d = join(dest, item);
        const st = statSync(s);
        if (st.isDirectory()) {
            mkdirSync(d, { recursive: true });
            copyRecursive(s, d);
        } else {
            renameSync(s, d);
            console.log(`copied: ${d}`);
        }
    }
}
