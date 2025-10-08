import { ChildrenOnly } from "@/shared/types/react";
import { BoxStyle } from "./box.type";
import { CheckerProps } from "@/shared/types/object";
import { boxVariants } from "./box.css";

interface BoxProps extends BoxStyle, ChildrenOnly {}

export function Box<T extends BoxProps>(
    props: CheckerProps<T, BoxProps, "Box Props Error">
) {
    const {
        as = "div",
        width = "auto",
        height = "auto",
        boxShadow = "none",
        color = "white",
        border = "none",
        borderRadius = "none",
        style,
        children
    } = props;

    const cn = [
        boxVariants.boxWidthStyle[width],
        boxVariants.boxHeightStyle[height],
        boxVariants.boxShadowStyle[boxShadow],
        boxVariants.colorStyle[color],
        boxVariants.border[border],
        boxVariants.boxBorderRadiusStyle[borderRadius]
    ].join(" ");

    const As = as;

    return (
        <As className={cn} style={style}>
            {children}
        </As>
    );
}
