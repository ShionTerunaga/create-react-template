import { resolve, basename } from "node:path";
import { Css, Framework, Lib } from "./template-src/template.static";
import { mkdirSync } from "node:fs";
import { isFolderEmpty } from "./helper/is-folder-empty";
import { green } from "picocolors";
import { installTemplate } from "./template-src/template.index";
import { addPackage } from "./install-lib/install-lib";

export async function createApp({
    appPath,
    framework,
    css,
    libs
}: {
    appPath: string;
    framework: Framework;
    css: Css;
    libs: Array<Lib>;
}) {
    const root = resolve(appPath);
    const appName = basename(appPath);

    mkdirSync(root, { recursive: true });

    if (!isFolderEmpty(root, appName)) {
        process.exit(1);
    }

    console.log(`Creating a new React app in ${green(root)}.`);
    console.log();

    process.chdir(root);

    await installTemplate({
        appName,
        root,
        framework,
        css
    });

    await addPackage({ root, css, libs });
}
