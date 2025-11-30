const frameworks = ["tanstack-router", "next/app", "next/pages"] as const;
export type Framework = (typeof frameworks)[number];

export interface InstallTemplateArgs {
    appName: string;
    root: string;
    framework: Framework;
    tailwind: boolean;
}

export interface TemplateInfo {
    framework: Framework;
}

export const libsArray = ["popup"] as const;
export type Lib = (typeof libsArray)[number];

interface LibrarySetting {
    lib: Lib;
    unitTest: boolean;
    storybook: boolean;
}

export type LibrarySettings = Array<LibrarySetting>;

export const librarySetting: LibrarySettings = [
    {
        lib: "popup",
        unitTest: true,
        storybook: true
    }
];
