import { styleVariants } from "@vanilla-extract/css";

export const boxWidthStyle = styleVariants({
    small: {
        width: 150
    },
    middle: {
        width: 300
    },
    big: {
        width: 450
    },
    auto: {
        width: "auto"
    },
    full: {
        width: "100vw"
    }
});

export const boxHeightStyle = styleVariants({
    small: {
        height: 150
    },
    middle: {
        height: 300
    },
    big: {
        height: 450
    },
    auto: {
        height: "auto"
    },
    full: {
        height: "100vh"
    }
});

export type BoxWidth = keyof typeof boxWidthStyle;
export type BoxHeight = keyof typeof boxHeightStyle;
