import { CheckerProps } from "@/shared/types/object";
import { ReactNode } from "react";
import { HeadingStyle } from "./heading.type";
import { headingFontStyle } from "./heading.css";
import { textColor } from "@/shared/theme/color.css";

type HeadingProps = HeadingStyle & {
    children: ReactNode;
};

export function Heading<T extends HeadingProps>(
    props: CheckerProps<T, HeadingProps, "Heading Props Error">
) {
    const {
        as = "h1",
        fontStyle = "firstBig",
        color = "textNormal",
        children
    } = props;

    const cn = [headingFontStyle[fontStyle], textColor[color]].join(" ");

    const As = as;
    return <As className={cn}>{children}</As>;
}
