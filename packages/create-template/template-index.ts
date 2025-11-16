import { copy } from "./helper/copy";
import { InstallTemplateArgs } from "./template-types";
import path from "path";
import { resultUtility } from "./utils/result";
import fs from "fs/promises";

export async function installTemplate({
    appName,
    root,
    framework,
    tailwind
}: InstallTemplateArgs) {
    const { isNG, checkPromiseVoid } = resultUtility;
    const css = tailwind ? "tailwind" : "vanilla-extract";

    const copySource = ["**/*"];

    const templatePath =
        "pkg" in process && process.pkg
            ? path.join(
                  path.dirname(process.execPath),
                  "template",
                  framework,
                  css
              )
            : path.join(__dirname, "template", framework, css);

    const res = await copy(copySource, root, {
        parents: true,
        cwd: templatePath,
        rename: (name) => {
            switch (name) {
                case "gitignore":
                    return `.${name}`;
                case "env":
                    return `.${name}`;
                case "package-template.json":
                    return "package.json";
                case "README.sample.md":
                    return "README.md";
                default:
                    return name;
            }
        }
    });

    if (isNG(res)) {
        console.error(res.err.message);

        process.exit(1);
    }

    const pkgPath = path.join(root, "package.json");

    const exists = await fs
        .stat(pkgPath)
        .then(() => true)
        .catch(() => false);

    if (!exists) return;

    const raw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(raw || "{}");

    if (!appName || typeof appName !== "string") return;

    pkg.name = appName;

    const writeResult = await checkPromiseVoid({
        fn: async () => {
            await fs.writeFile(
                pkgPath,
                JSON.stringify(pkg, null, 2) + "\n",
                "utf8"
            );
        },
        err: (e) => new Error(`Failed to update package.json name`)
    });

    if (isNG(writeResult)) {
        console.error(
            "Failed to update package.json name:",
            writeResult.err.message
        );
        process.exit(1);
    }
}
