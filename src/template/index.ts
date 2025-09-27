import { copy } from "src/create-template/helper/copy";
import { InstallTemplateArgs } from "./types";
import path from "path";
import { RESULT_NG } from "@/utils/result";

export async function installTemplate({
    appName,
    root,
    framework
}: InstallTemplateArgs) {
    const copySource = ["**"];
    const templatePath = path.join(__dirname, root);

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
}
