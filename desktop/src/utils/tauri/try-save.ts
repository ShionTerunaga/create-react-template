import { DialogFilter, save } from "@tauri-apps/plugin-dialog";
import { saveError, SaveError } from "../error/tauri/save";
import { Result, resultUtility } from "../result";
import { Option, optionUtility } from "../option";
import { isNull } from "../is";

export async function trySave({
    path,
    filters
}: {
    path: string;
    filters?: DialogFilter[];
}): Promise<Result<Option<string>, SaveError>> {
    const { checkPromiseReturn } = resultUtility;
    const { createNone, createSome } = optionUtility;

    return await checkPromiseReturn<Option<string>, SaveError>({
        fn: async () => {
            const result = await save({
                defaultPath: path,
                filters: filters
            });

            if (isNull(result)) {
                return createNone();
            }

            return createSome(result);
        },
        err: saveError(`Failed to save file at path: ${path}`)
    });
}
