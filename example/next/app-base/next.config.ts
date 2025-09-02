import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL("https://ik.imagekit.io/**")]
    }
};

export default withVanillaExtract(nextConfig);
