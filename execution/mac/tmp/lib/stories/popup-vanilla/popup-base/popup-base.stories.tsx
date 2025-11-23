import { PopupBase } from "./popup-base";
import { popupAction } from "@/lib/popup/popup.action";

export default {
    title: "Popup/Vanilla/PopupBase",
    component: PopupBase
};

export function ButtonToOpenPopup() {
    const { close, open } = popupAction;

    return (
        <button
            onClick={() =>
                open(
                    <div style={{ padding: 16, backgroundColor: "white" }}>
                        Story popup content
                        <br />
                        <button
                            style={{
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: 4
                            }}
                            onClick={() => close()}
                        >
                            Close
                        </button>
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
