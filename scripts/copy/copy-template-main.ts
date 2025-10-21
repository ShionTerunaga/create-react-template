import path from "path";
import { run } from "./copy-logic";

function main() {
    const root = path.resolve(__dirname, "..", ".."); // repo root
    const srcAppDir = path.join(root, "main-template", "next", "app");
    const destAppBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "app"
    );

    run(srcAppDir, destAppBase);

    const srcPagesDir = path.join(root, "main-template", "next", "pages");
    const destPagesBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "pages"
    );

    run(srcPagesDir, destPagesBase);

    const srcSrcDir = path.join(root, "main-template", "tanstack-router");
    const destSrcTanstackBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "tanstack-router"
    );

    run(srcSrcDir, destSrcTanstackBase);
}

main();
