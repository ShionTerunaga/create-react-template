import { Property } from "csstype";
import { Dict } from "../types/object";

export const appTheme: Dict<Color> = {
    textNormal: "#333",
    textWhite: "#FFFFFF",
    likeBlue: "aqua",
    likeGreen: "#33FFCC",
    popupBackground: "rgba(0,0,0,0.6)"
};

export type Color =
    | `var(--${string})`
    | Property.Color
    | (`var(--${string})` | Property.Color | undefined)[];

export type AppTheme = typeof appTheme;
