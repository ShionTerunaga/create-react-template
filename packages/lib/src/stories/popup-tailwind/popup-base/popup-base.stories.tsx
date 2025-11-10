import * as React from "react";
import { PopupBase } from "./popup-base";
import { popupStore } from "@/lib/popup/popup-vanilla/store";

export default {
    title: "Popup/Tailwind/PopupBase",
    component: PopupBase
};

export const Default = () => (
    <>
        <button
            onClick={() =>
                popupStore.open(
                    <div className="p-4 bg-white">
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
