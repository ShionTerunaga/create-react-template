import prompts from "prompts";
import { Option, optionUtility } from "../utils/option";
import { resultUtility } from "../utils/result";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
    Lib,
    librarySetting,
    libsArray
} from "../template-src/template.static";
import { copy } from "../helper/copy";
import { foundFolder } from "../utils/found-file";
import fs from "fs/promises";

interface SelectLib {
    title: string;
    value: Lib;
}

const selectLibList: Array<SelectLib> = [{ title: "Popup", value: "popup" }];

function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

function isLibsArray(value: unknown): value is Array<Lib> {
    return (
        isArray(value) && value.every((item) => libsArray.includes(item as Lib))
    );
}

function isLib(value: unknown): value is Lib {
    return libsArray.includes(value as Lib);
}

export async function addPackage({
    root,
    isTailwind
}: {
    root: string;
    isTailwind: boolean;
}) {
    const { optionConversion, isNone } = optionUtility;
    const { createNg, createOk, isNG, checkPromiseReturn, checkPromiseVoid } =
        resultUtility;

    const res = await prompts({
        type: "multiselect",
        name: "packages",
        message: "Select packages to add",
        choices: selectLibList,
        hint: "(Use space to select, and enter to submit)",
        instructions: false
    });

    const optionSelected: Option<unknown> = optionConversion(res.packages);

    if (isNone(optionSelected)) {
        console.log("No packages selected. Exiting.");

        return;
    }

    const selectedPackages = optionSelected.value;

    const resultSelected = isLibsArray(selectedPackages)
        ? createOk(selectedPackages)
        : isLib(selectedPackages)
          ? createOk([selectedPackages])
          : createNg(new Error("Selected packages have an invalid structure."));

    if (isNG(resultSelected)) {
        console.error(resultSelected.err.message);
        console.error(resultSelected.err.stack ?? "");

        process.exit(1);
    }

    const appPath = path.join(root, "src", "lib");
    const testPath = path.join(root, "src", "__test__", "lib");
    const storybookPath = path.join(root, "src", "stories", "lib");

    const copySource = ["**/*"];

    mkdirSync(appPath, { recursive: true });

    mkdirSync(testPath, { recursive: true });

    mkdirSync(storybookPath, { recursive: true });

    const addLibs = librarySetting.filter((setting) =>
        resultSelected.value.some((lib) => lib === setting.lib)
    );

    for (const lib of addLibs) {
        const srcLibDir = path.join(appPath, lib.lib);

        mkdirSync(srcLibDir, { recursive: true });

        const templatePath = [
            path.join(__dirname, "lib", "lib", lib.lib),
            path.join(__dirname, "..", "lib", "lib", lib.lib)
        ];

        const resultPath = foundFolder(templatePath);

        if (isNG(resultPath)) {
            console.error("Library folder not found:", resultPath.err.message);

            process.exit(1);
        }

        //copy packages
        const res = await copy(copySource, srcLibDir, {
            parents: true,
            cwd: resultPath.value
        });

        if (isNG(res)) {
            console.error(res.err.message);

            process.exit(1);
        }

        if (lib.storybook) {
            const srcStorybookDir = path.join(storybookPath, lib.lib);

            mkdirSync(srcStorybookDir, { recursive: true });

            const storybookTemplatePath = [
                path.join(
                    __dirname,
                    "lib",
                    "stories",
                    isTailwind ? lib.lib + "-tailwind" : lib.lib + "-vanilla"
                ),
                path.join(
                    __dirname,
                    "..",
                    "lib",
                    "stories",
                    isTailwind ? lib.lib + "-tailwind" : lib.lib + "-vanilla"
                )
            ];

            const storybookResultPath = foundFolder(storybookTemplatePath);

            if (isNG(storybookResultPath)) {
                console.error(
                    "Storybook folder not found:",
                    storybookResultPath.err.message
                );

                process.exit(1);
            }

            const storyRes = await copy(copySource, srcStorybookDir, {
                parents: true,
                cwd: storybookResultPath.value
            });

            if (isNG(storyRes)) {
                console.error(storyRes.err.message);

                process.exit(1);
            }
        }

        if (lib.unitTest) {
            const srcTestDir = path.join(testPath, lib.lib);
            mkdirSync(srcTestDir, { recursive: true });

            const testTemplatePath = [
                path.join(__dirname, "lib", "__test__", lib.lib),
                path.join(__dirname, "..", "lib", "__test__", lib.lib)
            ];

            const testResultPath = foundFolder(testTemplatePath);

            if (isNG(testResultPath)) {
                console.error(
                    "Unit test folder not found:",
                    testResultPath.err.message
                );

                process.exit(1);
            }

            const testRes = await copy(copySource, srcTestDir, {
                parents: true,
                cwd: testResultPath.value
            });

            if (isNG(testRes)) {
                console.error(testRes.err.message);

                process.exit(1);
            }
        }
    }

    const pkgPath = path.join(root, "template.info.json");

    const pkgInfo = { libs: resultSelected.value };

    const raw = await checkPromiseReturn({
        fn: async () => await fs.readFile(pkgPath, "utf8"),
        err: () => new Error(`Failed to read template.info.json`)
    });

    if (isNG(raw)) {
        console.error(raw.err.message);
        console.error(raw.err.stack ?? "");

        process.exit(1);
    }

    const existingInfo = JSON.parse(raw.value || "{}");

    const updatedInfo = { ...existingInfo, ...pkgInfo };

    const writeResult = await checkPromiseVoid({
        fn: async () => {
            await fs.writeFile(
                pkgPath,
                JSON.stringify(updatedInfo, null, 2),
                "utf8"
            );
        },
        err: () => new Error(`Failed to update template.info.json`)
    });

    if (isNG(writeResult)) {
        console.error(writeResult.err.message);
        console.error(writeResult.err.stack ?? "");

        process.exit(1);
    }

    console.log("✅ Added selected packages:", resultSelected.value.join(", "));
}
