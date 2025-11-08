import * as React from "react";
import { PopupBase } from "./popup-base";
import { popupStore } from "@/lib/popup/store";

export default {
    title: "Popup/Vanilla/PopupBase",
    component: PopupBase
};

export const Default = () => (
    <>
        <button
            onClick={() =>
                popupStore.open(
                    <div style={{ padding: 16, backgroundColor: "white" }}>
                        Story popup content
                        <br />
                        <button onClick={() => popupStore.close()}>
                            Close
                        </button>
                    </div>
                )
            }
        >
            Open Popup
        </button>
        <PopupBase />
    </>
);
