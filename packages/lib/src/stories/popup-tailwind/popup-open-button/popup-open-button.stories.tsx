import { PopupOpenButton } from "./popup-open-button";
import PopupBase from "../popup-base/popup-base";
import { popupAction } from "@/lib/popup/popup.action";

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
        <button onClick={() => popupAction.close()}>Close via store</button>

        <PopupBase />
    </>
);
