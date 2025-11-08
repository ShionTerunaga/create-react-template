import path from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    async viteFinal(config) {
        // Map TypeScript path alias "@/" to the package src directory so imports
        // like `@/lib/...` resolve in Storybook's Vite dev server.
        config.resolve = config.resolve ?? {};
        const alias = config.resolve.alias ?? [];
        // Ensure alias is an array and push our mapping.
        const replacementPath = path.resolve(process.cwd(), "src/");
        if (Array.isArray(alias)) {
            alias.push({
                find: "@/",
                replacement: replacementPath
            });
        } else if (typeof alias === "object") {
            // If alias is an object map, set the key
            (config.resolve.alias as Record<string, string>)["@/"] =
                replacementPath;
        }
        config.resolve.alias = alias;
        // Dynamically import helper plugins used by Vite so Storybook's Vite build
        // can handle TypeScript path-aliases and `.css.ts` files produced by vanilla-extract.
        config.plugins = config.plugins ?? [];
        try {
            const { default: tsconfigPaths } = await import(
                "vite-tsconfig-paths"
            );
            config.plugins.push(tsconfigPaths());
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                "vite-tsconfig-paths is not installed. Install it to enable tsconfig path resolution."
            );
        }

        try {
            const { vanillaExtractPlugin } = await import(
                "@vanilla-extract/vite-plugin"
            );
            config.plugins.push(vanillaExtractPlugin());
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                "@vanilla-extract/vite-plugin is not installed. Install it to enable vanilla-extract support."
            );
        }

        return config;
    }
};

export default config;
