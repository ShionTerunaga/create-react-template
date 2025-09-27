import { createResult, Result } from "@/utils/result";
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
): Promise<Result<Promise<void[]>, Error>> {
    const sources = typeof src === "string" ? [src] : src;

    if (sources.length === 0 || dest === "") {
        return createResult.ng(new Error("src or dest is empty"));
    }

    const sourceFiles = await glob(sources, {
        cwd,
        dot: true,
        onlyFiles: false,
        followSymbolicLinks: false
    });

    const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;

    return createResult.ok(
        Promise.all(
            sourceFiles.map(async (p) => {
                const dirName = dirname(p);
                const baseName = rename(basename(p));

                const from = cwd ? resolve(cwd, p) : p;
                const to = parents
                    ? join(destRelativeToCwd, dirName, baseName)
                    : join(destRelativeToCwd, baseName);

                await mkdir(dirname(to), { recursive: true });

                return copyFile(from, to);
            })
        )
    );
}
