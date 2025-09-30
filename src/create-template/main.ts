import { Command } from "commander";
import { basename, resolve } from "node:path";
import Conf from "conf";
import prompts, { InitialReturnValue } from "prompts";
import { validateNpmName } from "./helper/validate-npm-name";
import { existsSync } from "node:fs";
import { isFolderEmpty } from "./helper/is-folder-empty";
import { TemplateInfo } from "./types";
import { isTemplateInfo } from "./helper/is";
import { blue, bold, red } from "picocolors";
import { createApp } from "./create-app";

const handleSigTerm = () => process.exit(0);

process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);

const onPromptState = (state: {
    value: InitialReturnValue;
    aborted: boolean;
    exited: boolean;
}) => {
    if (state.aborted) {
        process.stdout.write("\x1B[?25h");
        process.stdout.write("\n");
        process.exit(1);
    }
};

const program = new Command("create-next")
    .version("0.1.0", "-v, --version", "output the current version")
    .argument("[directory]")
    .usage("[directory] [options]")
    .helpOption("-h, --help", "display help for command")
    .allowUnknownOption()
    .parse(process.argv);

const opts = program.opts();

let projectPath: string = "";

export async function run(): Promise<void> {
    const conf = new Conf({ projectName: "create-react-template" });

    const res = await prompts({
        onState: onPromptState,
        type: "text",
        name: "path",
        message: "What is your project named?",
        initial: "my-project",
        validate: (name: string): boolean | string => {
            const validation = validateNpmName(name);

            if (validation.valid) {
                return true;
            }

            return `Invalid project name: ${validation.problems?.join(", ")}`;
        }
    });

    projectPath =
        res.path && typeof res.path === "string"
            ? res.path.trim()
            : "my-project";

    const appPath = resolve(projectPath);
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

    const styleFramework = blue("framework");

    const { framework } = await prompts({
        onState: onPromptState,
        type: "select",
        name: "framework",
        message: `Select a ${styleFramework} for your project:`,
        choices: [
            { title: "TanStack Router", value: "tanstack-router" },
            { title: "Next.js (App Router)", value: "next/app" },
            { title: "Next.js (Pages Router)", value: "next/pages" }
        ],
        initial: 0
    });

    const templateInfo: unknown = {
        framework
    };

    if (!isTemplateInfo(templateInfo)) {
        console.error("Invalid template information.");

        process.exit(1);
    }

    opts.framework = framework;

    try {
        await createApp({
            appPath,
            templateInfo
        });
    } catch (e) {
        console.error(red("An error occurred while creating the project."));
        if (e instanceof Error) {
            console.error(red(e.message));
        }
        process.exit(1);
    }
}

export function notify() {
    console.log("cd " + projectPath);

    console.log("pnpm install");

    console.log("pnpm dev");

    console.log();

    console.log(bold("Happy hacking!"));
    process.exit(0);
}

export function errorExit() {
    console.error(red("The operation was cancelled."));
    process.exit(1);
}
