export interface TemplateInfo {
    framework: "tanstack-router" | "next/app" | "next/pages";
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
