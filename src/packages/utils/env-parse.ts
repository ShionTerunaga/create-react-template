import { type Option, createOption } from "./option";

export function envParse(env: string | undefined): Option<string> {
    if (env === undefined || env === null) {
        return createOption.none();
    }

    return createOption.some<string>(env);
}
