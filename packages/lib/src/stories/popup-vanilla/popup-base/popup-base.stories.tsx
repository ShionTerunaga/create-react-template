import { PopupOpenButton } from "../popup-open-button/popup-open-button";
import { PopupBase } from "./popup-base";
import { popupAction } from "@/lib/popup/popup.action";

export default {
    title: "Popup/Vanilla/PopupBase",
    component: PopupBase
};

export function ButtonToOpenPopup() {
    const { close } = popupAction;

    return (
        <PopupOpenButton
            popupChildren={
                <div style={{ padding: 16, backgroundColor: "white" }}>
                    Story popup content
                    <br />
                    <button
                        style={{
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: 4,
                            padding: "8px 16px"
                        }}
                        onClick={() => close()}
                    >
                        Close
                    </button>
                </div>
            }
            style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: 4,
                cursor: "pointer",
                border: "none",
                fontSize: 14
            }}
        >
            Open Popup
        </PopupOpenButton>
    );
}

export const Default = () => (
    <>
        <h1>Underlying Content</h1>

        <ButtonToOpenPopup />

        <PopupBase />
    </>
);
