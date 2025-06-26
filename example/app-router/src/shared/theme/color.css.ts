import { styleVariants } from "@vanilla-extract/css";

export const textColor = styleVariants({
    textNormal: { color: "#333" },
    textWhite: { color: "#FFFFFF" }
});

export const backgroundColor = styleVariants({
    likeBlue: { color: "aqua" },
    likeGreen: { color: "#33FFCC" }
});

export type TextTheme = keyof typeof textColor;
export type BackgroundTheme = keyof typeof backgroundColor;
