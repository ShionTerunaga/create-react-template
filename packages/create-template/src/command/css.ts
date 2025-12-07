import { isCss } from "@/utils/is";
import { type Option, optionUtility } from "@/utils/option";
import { resultUtility } from "@/utils/result";

export async function cssCommand(optionCss: Option<unknown>) {
    const { isSome } = optionUtility;
    const { createOk } = resultUtility;

    if (isSome(optionCss) && isCss(optionCss.value)) {
        return createOk(optionCss.value);
    }
}
