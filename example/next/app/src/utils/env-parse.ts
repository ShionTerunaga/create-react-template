import { Option, createOption } from "./option";

export function envParse(env: string | undefined): Option<string> {
    if (env === undefined) {
        return createOption.none();
    }

    return createOption.some<string>(env);
}
