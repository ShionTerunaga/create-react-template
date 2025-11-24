import { PopupOpenButton } from "./popup-open-button";
import { PopupSampleLayout } from "../popup-layout/popup-layout";
import { PopupCloseButton } from "../popup-close-button/popup-close-button";
import { PopupBase } from "../popup-base/popup-base";
import popupOpenButtonStyles from "./popup-open-button.css";

export default {
    title: "Popup/Vanilla/PopupOpenButton",
    component: PopupOpenButton
};

const ExamplePopupContent = () => (
    <PopupOpenButton
        popupChildren={
            <PopupSampleLayout>
                Popup content
                <br />
                <PopupCloseButton
                    style={{
                        backgroundColor: "red",
                        padding: "8px 16px",
                        color: "white",
                        borderRadius: 4
                    }}
                >
                    Close
                </PopupCloseButton>
            </PopupSampleLayout>
        }
        className={popupOpenButtonStyles.button}
    >
        Open Popup
    </PopupOpenButton>
);

export const Default = () => (
    <>
        <h1>hello world</h1>
        <ExamplePopupContent />
        <PopupBase />
    </>
);
