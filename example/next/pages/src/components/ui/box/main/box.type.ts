import { ElementType } from "react";
import { boxVariants } from "./box.css";

export type BoxWidth = keyof typeof boxVariants.boxWidthStyle;
export type BoxHeight = keyof typeof boxVariants.boxHeightStyle;
export type BoxShadow = keyof typeof boxVariants.boxShadowStyle;
export type BoxColor = keyof typeof boxVariants.colorStyle;
export type BoxBorder = keyof typeof boxVariants.border;
export type BoxBorderRadius = keyof typeof boxVariants.boxBorderRadiusStyle;

export interface BoxStyle {
    as?: Extract<ElementType, "div" | "section" | "article" | "main">;
    width?: BoxWidth;
    height?: BoxHeight;
    boxShadow?: BoxShadow;
    color?: BoxColor;
    border?: BoxBorder;
    borderRadius?: BoxBorderRadius;
    style?: React.CSSProperties;
}
