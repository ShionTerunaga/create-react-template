import prompts from "prompts";
import { Option, optionUtility } from "../utils/option";
import { resultUtility } from "../utils/result";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { Lib } from "../template-src/template.static";

interface SelectLib {
    title: string;
    value: Lib;
}

const libs: Array<SelectLib> = [{ title: "Popup", value: "popup" }];

function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

function isLibsArray(value: unknown): value is SelectLib[] {
    return (
        isArray(value) &&
        value.every(
            (item) =>
                typeof item === "object" &&
                item !== null &&
                "title" in item &&
                typeof item.title === "string" &&
                "value" in item &&
                typeof item.value === "string"
        )
    );
}

function isLib(value: unknown): value is SelectLib {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return (
        "title" in value &&
        typeof value.title === "string" &&
        "value" in value &&
        typeof value.value === "string"
    );
}

export async function addPackage({
    root,
    isTailwind
}: {
    root: string;
    isTailwind: boolean;
}) {
    const { optionConversion, isNone } = optionUtility;
    const { createNg, createOk, isNG } = resultUtility;

    const res = await prompts({
        type: "multiselect",
        name: "packages",
        message: "Select packages to add",
        choices: libs,
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

    //tailwindか別のものかを判定する
    //libからテストと実際のlibとstorybookをコピーする(storybookは一部のUIライブラリのみ)

    const appPath = path.join(root, "src", "lib");
    const testPath = path.join(root, "src", "__test__");
    const storybookPath = path.join(root, "src", "stories");

    mkdirSync(appPath, { recursive: true });

    //セレクトしたパッケージ毎に作成したプロジェクトのlibにコピーしていく
    //storiesがある場合はstorybookにもコピーしていく
    //unit testも同様にコピーしていく
}
