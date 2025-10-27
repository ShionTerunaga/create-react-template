#!/usr/bin/env ts-node
import { promisify } from "node:util";
import { exec as _exec } from "node:child_process";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { mkdir, rm, readdir, stat, rename } from "node:fs/promises";
import type { Dirent } from "node:fs";

const exec = promisify(_exec);

async function run() {
    const cwd = process.cwd();
    console.log("working dir:", cwd);

    // 1) 同じディレクトリにあるファイルフォルダを全て削除
    //    NOTE: このスクリプト自身を削除すると実行中に問題が起きるため除外します
    const selfName = basename(process.argv[1] || __filename);
    console.log(`cleaning directory: ${cwd} (preserving ${selfName})`);
    await cleanDirectory(cwd, selfName);

    // 2) release ブランチの execution/win を zip してダウンロード
    const tmp = await mkdirTmp();
    const zipPath = join(tmp, "execution_win.zip");

    try {
        const repoRoot = (
            await exec("git rev-parse --show-toplevel", { cwd })
        ).stdout.trim();
        if (!repoRoot) throw new Error("not a git repo");

        console.log("creating zip from git archive (release:execution/win)");
        const archiveCmd = `git -C ${quote(repoRoot)} archive --format=zip --output=${quote(zipPath)} release:execution/win`;
        await exec(archiveCmd);
        console.log("git archive created", zipPath);
    } catch (e) {
        console.warn(
            "git archive failed, will fallback to GitHub branch zip download:",
            (e as Error).message
        );
        try {
            const remoteUrl = (
                await exec("git config --get remote.origin.url", { cwd })
            ).stdout.trim();
            const { owner, repo } = parseGitRemote(remoteUrl || "");
            if (!owner || !repo) throw new Error("cannot parse remote URL");
            const downloadUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/release.zip`;
            console.log("downloading branch zip from", downloadUrl);
            await exec(`curl -L ${quote(downloadUrl)} -o ${quote(zipPath)}`);
            console.log("downloaded zip to", zipPath);
        } catch (ee) {
            throw new Error(
                `failed to obtain zip via git archive or GitHub download: ${(ee as Error).message}`
            );
        }
    }

    // 3) 解凍 (Windows: PowerShell Expand-Archive)
    const outDir = join(tmp, "out");
    await mkdir(outDir, { recursive: true });
    console.log("extracting to", outDir);
    // Use PowerShell Expand-Archive which is available on Windows
    await exec(
        `powershell -NoProfile -Command Expand-Archive -LiteralPath ${quote(zipPath)} -DestinationPath ${quote(outDir)} -Force`
    );

    // 4) 解凍したフォルダの一つ前に全てのフォルダ・ファイルを移動
    const extractedRoot = await findExtractedRoot(outDir);
    console.log("extracted root:", extractedRoot);

    const candidate = join(extractedRoot, "execution", "win");
    const sourceDir = (await exists(candidate)) ? candidate : extractedRoot;
    console.log("source dir to move from:", sourceDir);

    await moveAllContents(sourceDir, cwd);
    console.log("moved contents to", cwd);

    // 5) cleanup
    await rm(zipPath, { force: true });
    console.log("removed zip", zipPath);
    await rm(tmp, { recursive: true, force: true });
    console.log("cleaned temporary files");

    console.log("done");
}

async function cleanDirectory(dir: string, preserveBasename?: string) {
    const entries = (await readdir(dir, {
        withFileTypes: true
    } as any)) as unknown as Dirent[];
    await Promise.all(
        entries.map(async (ent: Dirent) => {
            if (ent.name === preserveBasename) return;
            if (ent.name === ".git") return;
            const p = join(dir, ent.name);
            await rm(p, { recursive: true, force: true });
            console.log("removed:", p);
        })
    );
}

async function mkdirTmp() {
    const prefix = join(tmpdir(), "crt-exec-");
    const tmpPath = prefix + Date.now().toString();
    try {
        await mkdir(tmpPath, { recursive: true });
    } catch {
        // ignore
    }
    return tmpPath;
}

function quote(s: string) {
    return `'${s.replace(/'/g, "'\\''")}'`;
}

function parseGitRemote(url: string) {
    if (!url) return { owner: null, repo: null } as any;
    let m = url.match(/[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (m) return { owner: m[1], repo: m[2] };
    return { owner: null, repo: null } as any;
}

async function exists(p: string) {
    try {
        await stat(p);
        return true;
    } catch {
        return false;
    }
}

async function findExtractedRoot(outDir: string) {
    const items = (await readdir(outDir, {
        withFileTypes: true
    } as any)) as unknown as Dirent[];
    const dirs = items
        .filter((d: Dirent) => d.isDirectory())
        .map((d: Dirent) => d.name);
    if (dirs.length === 1) return join(outDir, dirs[0]);
    return outDir;
}

async function moveAllContents(src: string, dest: string) {
    const items = (await readdir(src, {
        withFileTypes: true
    } as any)) as unknown as Dirent[];
    for (const it of items) {
        const from = join(src, it.name);
        const to = join(dest, it.name);
        try {
            await rename(from, to);
        } catch (e) {
            await exec(
                `powershell -NoProfile -Command Move-Item -LiteralPath ${quote(from)} -Destination ${quote(to)} -Force`
            );
        }
        console.log(`moved ${from} -> ${to}`);
    }
}

if (require.main === module) {
    run().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

export default run;
