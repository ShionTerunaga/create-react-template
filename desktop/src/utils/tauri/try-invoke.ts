import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import { invokeError, InvokeError } from "../error/tauri/invoke";
import { type Result, resultUtility } from "../result";

export type InvokeCommand = "zip_template";

export async function tryInvokeHasParams({
    command,
    args
}: {
    command: InvokeCommand;
    args: InvokeArgs;
}): Promise<Result<unknown, InvokeError>> {
    const { checkPromiseReturn } = resultUtility;

    return await checkPromiseReturn<unknown, InvokeError>({
        fn: () => invoke(command, args),
        err: invokeError("Failed to invoke command: " + command)
    });
}
