import { TextTheme } from "@/shared/theme/color.css";
import { ElementType } from "react";
import { headingFontStyle } from "./heading.css";

export type HeadingFont = keyof typeof headingFontStyle;

export interface HeadingStyle {
    as?: Extract<ElementType, "h1" | "h2" | "h3">;
    fontStyle?: HeadingFont;
    color?: TextTheme;
}
