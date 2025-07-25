import type { StorybookConfig } from "@storybook/nextjs";
import { VanillaExtractPlugin } from "@vanilla-extract/webpack-plugin";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-styling-webpack"],
    framework: {
        name: "@storybook/nextjs",
        options: {}
    },
    staticDirs: ["../public"],
    webpackFinal: (config) => {
        config.plugins?.push(new VanillaExtractPlugin());

        config.module?.rules?.push({
            test: /\.vanilla\.css$/i,
            use: [
                require.resolve("style-loader"),
                {
                    loader: require.resolve("css-loader"),
                    options: {
                        url: false
                    }
                }
            ]
        });

        return config;
    }
};
export default config;
