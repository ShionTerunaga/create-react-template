import path from "path";
import { run } from "./copy-logic";

function main() {
    const root = path.resolve(__dirname, "..", ".."); // repo root
    const srcAppVanillaExtractDir = path.join(
        root,
        "main-template",
        "next",
        "app",
        "vanilla-extract"
    );
    const destAppVanillaExtractBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "app",
        "vanilla-extract"
    );

    run(srcAppVanillaExtractDir, destAppVanillaExtractBase);

    const srcAppTailwindDir = path.join(
        root,
        "main-template",
        "next",
        "app",
        "tailwind"
    );
    const destAppTailwindBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "app",
        "tailwind"
    );

    run(srcAppTailwindDir, destAppTailwindBase);

    const srcPagesDir = path.join(
        root,
        "main-template",
        "next",
        "pages",
        "tailwind"
    );
    const destPagesTailwindBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "pages",
        "tailwind"
    );

    run(srcPagesDir, destPagesTailwindBase);

    const srcPagesVanillaExtractDir = path.join(
        root,
        "main-template",
        "next",
        "pages",
        "vanilla-extract"
    );
    const destPagesVanillaExtractBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "next",
        "pages",
        "vanilla-extract"
    );

    run(srcPagesVanillaExtractDir, destPagesVanillaExtractBase);

    const srcTailwindSrcDir = path.join(
        root,
        "main-template",
        "tanstack-router",
        "tailwind"
    );
    const destTailWindSrcTanstackBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "tanstack-router",
        "tailwind"
    );

    run(srcTailwindSrcDir, destTailWindSrcTanstackBase);

    const srcVanillaExtractSrcDir = path.join(
        root,
        "main-template",
        "tanstack-router",
        "vanilla-extract"
    );
    const destVanillaExtractSrcTanstackBase = path.join(
        root,
        "packages",
        "create-template",
        "template",
        "tanstack-router",
        "vanilla-extract"
    );

    run(srcVanillaExtractSrcDir, destVanillaExtractSrcTanstackBase);
}

main();
