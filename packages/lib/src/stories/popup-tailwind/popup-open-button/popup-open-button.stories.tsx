import * as React from "react";
import { PopupOpenButton } from "./popup-open-button";
import { popupStore } from "@/lib/popup/popup-vanilla/store";
import PopupBase from "../popup-base/popup-base";

export default {
    title: "Popup/Tailwind/PopupOpenButton",
    component: PopupOpenButton
};

export const Default = () => (
    <>
        <PopupOpenButton
            popupChildren={<div className="p-4 bg-red">Hello popup</div>}
        >
            Open Popup
        </PopupOpenButton>
        <div style={{ height: 8 }} />
        <button onClick={() => popupStore.close()}>Close via store</button>

        <PopupBase />
    </>
);
