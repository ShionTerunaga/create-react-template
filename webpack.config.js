const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const RemoveNodeSchemePlugin = require("./RemoveNodeSchemePlugin");

module.exports = {
    mode: "production",
    entry: "./src/create-template/index.ts", // エントリーポイント
    output: {
        filename: "bundle.js", // 出力ファイル名
        path: path.resolve(__dirname, "dist"), // 出力先ディレクトリ
        library: {
            name: "createTemplate", // ライブラリ名
            type: "umd" // UMD形式で出力
        }
    },
    resolve: {
        extensions: [".ts", ".js"], // 解決可能な拡張子
        alias: {
            "node:assert": "assert",
            "node:fs": "browserify-fs",
            "node:path": "path-browserify",
            "node:crypto": "crypto-browserify",
            "node:stream": "stream-browserify",
            "node:util": "util",
            "node:os": "os-browserify/browser",
            "node:process": "process/browser"
        },
        fallback: {
            fs: false,
            path: require.resolve("path-browserify"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            os: require.resolve("os-browserify/browser"),
            util: require.resolve("util"),
            readline: false, // readlineを無効化
            module: false, // moduleを無効化
            child_process: false // child_processを無効化
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // TypeScriptファイルを対象
                use: "ts-loader", // ts-loaderを使用
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser"
        }),
        new NodePolyfillPlugin(), // Node.jsのポリフィルを追加
        new RemoveNodeSchemePlugin() // node:スキームを削除するプラグインを追加
    ],
    externals: {
        fs: "commonjs fs",
        path: "commonjs path",
        util: "commonjs util",
        os: "commonjs os"
    }
};
