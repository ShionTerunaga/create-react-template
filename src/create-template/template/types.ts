export interface InstallTemplateArgs {
    appName: string;
    root: string;
    framework: "tanstack-router" | "next/app" | "next/pages";
}
