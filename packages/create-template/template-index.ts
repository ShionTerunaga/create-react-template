import { copy } from "./helper/copy";
import { InstallTemplateArgs } from "./template-types";
import path from "path";
import { RESULT_NG } from "./utils/result";
import fs from "fs/promises";

export async function installTemplate({
    appName,
    root,
    framework
}: InstallTemplateArgs) {
    const copySource = ["**/*"];
    const templatePath =
        "pkg" in process && process.pkg
            ? path.join(path.dirname(process.execPath), "template", framework)
            : path.join(__dirname, "template", framework);

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

    if (res.kind === RESULT_NG) {
        console.error(res.err.message);

        process.exit(1);
    }

    try {
        const pkgPath = path.join(root, "package.json");

        const exists = await fs
            .stat(pkgPath)
            .then(() => true)
            .catch(() => false);

        if (exists) {
            const raw = await fs.readFile(pkgPath, "utf8");
            const pkg = JSON.parse(raw || "{}");
            if (appName && typeof appName === "string") {
                pkg.name = appName;
                await fs.writeFile(
                    pkgPath,
                    JSON.stringify(pkg, null, 2) + "\n",
                    "utf8"
                );
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(
                "Failed to update package.json name:",
                err?.message ?? err
            );
        } else {
            console.error("Failed to update package.json name:", err);
        }

        process.exit(1);
    }
}
