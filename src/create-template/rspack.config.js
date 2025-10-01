const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('@rspack/core').Configuration} */
module.exports = {
    entry: "./src/create-template/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        clean: true // Clean the output directory before emit
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
        "./template/next": "commonjs ./template/next",
        "./template/tanstack-router": "commonjs ./template/tanstack-router"
    },
    plugins: [
        // Temporarily disable CopyPlugin to debug the issue
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "template/next"),
        //             to: path.resolve(
        //                 __dirname,
        //                 "../../dist/src/create-template/template/next"
        //             ),
        //             force: true
        //         },
        //         {
        //             from: path.resolve(__dirname, "template/tanstack-router"),
        //             to: path.resolve(
        //                 __dirname,
        //                 "../../dist/src/create-template/template/tanstack-router"
        //             ),
        //             force: true
        //         }
        //     ]
        // })
    ],
    target: "node", // Adjust target based on your environment (e.g., 'web' for browser)
    mode: "production"
};
