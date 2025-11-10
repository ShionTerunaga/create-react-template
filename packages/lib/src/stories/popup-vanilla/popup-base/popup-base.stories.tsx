import * as React from "react";
import { PopupBase } from "./popup-base";
import { popupStore } from "@/lib/popup/popup-vanilla/store";
import { usePopup } from "@/lib/popup/popup-vanilla";

export default {
    title: "Popup/Vanilla/PopupBase",
    component: PopupBase
};

export function ButtonToOpenPopup() {
    const popup = usePopup();

    return (
        <button
            onClick={() =>
                popup.open(
                    <div style={{ padding: 16, backgroundColor: "white" }}>
                        Story popup content
                        <br />
                        <button onClick={() => popup.close()}>Close</button>
                    </div>
                )
            }
        >
            Open Popup
        </button>
    );
}

export const Default = () => (
    <>
        <h1>Underlying Content</h1>

        <ButtonToOpenPopup />

        <PopupBase />
    </>
);
