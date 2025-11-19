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

const libs = ["popup"] as const;
export type Lib = (typeof libs)[number];

interface LibrarySetting {
    lib: Lib;
    unitTest: boolean;
    storybook: boolean;
}

export type LibrarySettings = Array<LibrarySetting>;

export const librarySetting: LibrarySettings = [
    {
        lib: "popup",
        unitTest: false,
        storybook: true
    }
];
