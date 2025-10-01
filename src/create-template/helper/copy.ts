import { createResult, Result } from "../utils/result";
import { async as glob } from "fast-glob";
import { copyFile, mkdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

interface CopyOptions {
    cwd?: string;
    rename?: (basename: string) => string;
    parents?: boolean;
}

const identity = (x: string) => x;

export async function copy(
    src: string | string[],
    dest: string,
    { cwd, rename = identity, parents = true }: CopyOptions
): Promise<Result<Promise<void>, Error>> {
    const sources = typeof src === "string" ? [src] : src;

    if (sources.length === 0 || dest === "") {
        return createResult.ng(new Error("src or dest is empty"));
    }

    const sourceFiles = await glob(sources, {
        cwd,
        dot: true,
        absolute: false,
        stats: false,
        onlyFiles: true
    });

    const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;

    for (const p of sourceFiles) {
        const dirName = dirname(p);

        const baseName = rename(basename(p));

        const from = cwd ? resolve(cwd, p) : p;
        const to = parents
            ? join(destRelativeToCwd, dirName, baseName)
            : join(destRelativeToCwd, baseName);

        await mkdir(dirname(to), { recursive: true });

        await copyFile(from, to);
    }

    return createResult.ok(Promise.resolve());
}
