const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('@rspack/core').Configuration} */
module.exports = {
    entry: "./index.ts",
    output: {
        path: path.resolve(__dirname, "../../dist/create-template"),
        filename: "bundle.js",
        clean: true
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        "./template": "commonjs ./template"
    },
    target: "node", // Adjust target based on your environment (e.g., 'web' for browser)
    mode: "production"
};
