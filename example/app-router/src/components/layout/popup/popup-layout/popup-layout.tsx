import { ChildrenOnly } from "@/shared/types/react";
import popupLayoutStyles from "./popup-layout.css";

export function PopupSampleLayout({ children }: ChildrenOnly) {
    return <div className={popupLayoutStyles.container}>{children}</div>;
}
