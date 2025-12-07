import { basename, resolve } from "node:path";
import prompts from "prompts";
import { validateNpmName } from "./helper/validate-npm-name";
import { existsSync } from "node:fs";
import { bold, red, green } from "picocolors";
import { createApp } from "./create-app";
import { Lib } from "./template-src/template.static";
import { Option, optionUtility } from "./utils/option";
import { resultUtility } from "./utils/result";
import { commanderCore } from "./command/core";
import { nameCommand } from "./command/name";
import { frameworkCommand } from "./command/framework";
import { isLib, isLibsArray } from "./utils/is";

const handleSigTerm = () => process.exit(0);

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

interface SelectLib {
    title: string;
    value: Lib;
}

const selectLibList: Array<SelectLib> = [
    { title: "Popup", value: "popup" },
    { title: "Loading", value: "loading" }
];

export async function run(): Promise<string> {
    const { optionConversion, isNone } = optionUtility;
    const { createNg, createOk, isNG } = resultUtility;

    const { optionName, optionFramework, onPromptState } = commanderCore;

    let isTailwind = false;

    const projectName = await nameCommand(optionName);

    if (isNG(projectName)) {
        console.error(red(projectName.err.message));
        console.error(projectName.err.stack ?? "");

        process.exit(1);
    }

    const appPath = resolve(projectName.value);
    const appName = basename(appPath);

    const validation = validateNpmName(appName);

    if (!validation.valid) {
        console.error(
            `Could not create a project called ${appName} because of npm naming restrictions:\n\n- ${validation.problems?.join(
                "\n- "
            )}\n`
        );
        process.exit(1);
    }

    if (existsSync(appName)) {
        console.error(
            red(
                `The directory ${appName} already exists. Please choose a different project name or remove the existing directory.\n`
            )
        );
        process.exit(1);
    }

    const frameworResult = await frameworkCommand(optionFramework);

    if (isNG(frameworResult)) {
        console.error(red(frameworResult.err.message));
        console.error(frameworResult.err.stack ?? "");
        process.exit(1);
    }

    const { tailwind } = await prompts({
        onState: onPromptState,
        type: "toggle",
        name: "tailwind",
        message: `Would you like to use tailwindCSS?`,
        initial: false,
        active: "Yes",
        inactive: "No"
    });

    isTailwind = Boolean(tailwind);

    const res = await prompts({
        onState: onPromptState,
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

    try {
        await createApp({
            appPath,
            framework: frameworResult.value,
            tailwind: isTailwind,
            libs: resultSelected.value
        });
    } catch (e) {
        console.error(red("An error occurred while creating the project."));
        if (e instanceof Error) {
            console.error(red(e.message));
        }
        process.exit(1);
    }

    return projectName.value;
}

export function notify(projectPath: string): void {
    console.log("cd " + projectPath);

    console.log(`Package install: \n\n ex) npm install`);

    console.log(`Application launch: \n\n ex) npm run dev`);

    console.log();

    console.log(bold(`${green("Happy hacking!")}`));

    process.exit(0);
}

export function errorExit() {
    console.error(red("The operation was cancelled."));

    process.exit(1);
}
