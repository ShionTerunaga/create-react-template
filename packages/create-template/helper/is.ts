import { TemplateInfo } from "../types";

export function isTemplateInfo(obj: unknown): obj is TemplateInfo {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }

    return (
        "framework" in obj &&
        (obj.framework === "tanstack-router" ||
            obj.framework === "next/app" ||
            obj.framework === "next/pages")
    );
}
