import { CheckerProps } from "@/shared/types/object";
import { HeadingStyle } from "./heading.type";
import { headingFontStyle } from "./heading.css";
import { textColor } from "@/shared/theme/design-system.css";
import { ChildrenOnly } from "@/shared/types/react";

type HeadingProps = HeadingStyle & ChildrenOnly;

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
